# Backfill Order.user from the verified account email for historic rows
# created before the FK existed.
from django.db import migrations


def backfill_order_user(apps, schema_editor):
    Order = apps.get_model('order', 'Order')
    User = apps.get_model('auth', 'User')
    email_to_id = {}
    for u in User.objects.exclude(email='').values('id', 'email'):
        email_to_id.setdefault((u['email'] or '').strip().lower(), u['id'])
    for o in Order.objects.filter(user__isnull=True).only('id', 'email'):
        uid = email_to_id.get((o.email or '').strip().lower())
        if uid:
            Order.objects.filter(pk=o.pk).update(user_id=uid)


def noop(apps, schema_editor):
    pass


class Migration(migrations.Migration):
    dependencies = [
        ('order', '0006_order_user'),
    ]

    operations = [
        migrations.RunPython(backfill_order_user, noop),
    ]
