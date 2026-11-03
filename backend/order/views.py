from django.db.models import Q
from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import Order, OrderItem
from .serializers import OrderSerializer, OrderItemSerializer

def _owned_queryset(user):
    """Staff see everything; customers see rows they own.

    Ownership is the user FK first, falling back to the verified account
    email for historic rows created before the FK existed.
    """
    qs = Order.objects.select_related('user').prefetch_related('items', 'items__product').order_by('-created_at')
    if user.is_staff or user.is_superuser:
        return qs
    filt = Q(user=user)
    if getattr(user, 'email', None):
        filt |= Q(email__iexact=user.email)
    return qs.filter(filt)


class OrderListCreateView(generics.ListCreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    queryset = Order.objects.all()

    def get_queryset(self):
        return _owned_queryset(self.request.user)

    def perform_create(self, serializer):
        # Owner/email are forced inside the serializer from request.user;
        # passing user here as well keeps the intent explicit.
        serializer.save()


class OrderDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    queryset = Order.objects.all()

    def get_permissions(self):
        # Reads stay owner-scoped; any write (PUT/PATCH/DELETE) is staff-only
        # so customers cannot edit totals, statuses, or each other's orders.
        # Safe methods fall through to IsAuthenticated + owner queryset.
        if self.request.method in ('GET', 'HEAD', 'OPTIONS'):
            return [IsAuthenticated()]
        return [IsAdminUser()]

    def get_queryset(self):
        return _owned_queryset(self.request.user)

    def perform_update(self, serializer):
        # Non-staff cannot touch admin-only status fields.
        if not (self.request.user.is_staff or self.request.user.is_superuser):
            for f in ('delivery_status', 'order_status', 'admin_note', 'total_amount', 'delivery_fee'):
                serializer.validated_data.pop(f, None)
        serializer.save()
