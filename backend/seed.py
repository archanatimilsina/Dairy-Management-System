"""Seed demo data for the Elsa Dairy Management System.

Run from backend/:
    DATABASE_URL=sqlite:///db.sqlite3 DEBUG=1 SECRET_KEY=dev python manage.py migrate
    DATABASE_URL=sqlite:///db.sqlite3 DEBUG=1 SECRET_KEY=dev python seed.py

Same script works on Render Shell (DATABASE_URL is already set there).
Idempotent: safe to re-run, existing rows are updated in place.
"""
import os
import sys
import urllib.request
from decimal import Decimal
from io import BytesIO

import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from django.contrib.auth.models import User  # noqa: E402
from django.core.files.base import ContentFile  # noqa: E402
from PIL import Image, ImageOps  # noqa: E402

from account.models import CompanyConfiguration, Profile  # noqa: E402
from product.models import Category, Product, Cart  # noqa: E402
from contact.models import Contact  # noqa: E402
from Feedbacks.models import Feedback  # noqa: E402
from order.models import Order, OrderItem  # noqa: E402

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PUBLIC_DIR = os.path.join(os.path.dirname(BASE_DIR), "frontend", "public")

REMOTE = "https://images.unsplash.com/{}?w=800&q=70"

# product_name -> (unsplash_id | local:file | mirror:other_key, category, price, stock, desc)
CATALOG = [
    ("Fresh Cow Milk", "Milk", Decimal("110"), 120,
     "Farm-fresh pasteurized cow milk, collected every morning from high-altitude pastures.",
     ("unsplash", "photo-1550583724-b2692b85b150", "cow-milk.jpg")),
    ("Buffalo Milk", "Milk", Decimal("140"), 100,
     "Rich and creamy buffalo milk with higher fat content. Ideal for tea, curd and ghee.",
     ("unsplash", "photo-1563636619-e9143da7973b", "buffalo-milk.jpg")),
    ("Low-Fat Toned Milk", "Milk", Decimal("95"), 150,
     "Light toned milk for everyday health-conscious families. Same freshness, less fat.",
     ("local", "img1.jpg", "toned-milk.jpg")),
    ("Pure Cow Ghee", "Ghee", Decimal("1450"), 40,
     "Slow-cooked danedar ghee from cow milk. Granular texture, rich aroma.",
     ("mirror", "photo-1589985270826-4b7bb135bc9d", "cow-ghee.jpg")),
    ("Buffalo Ghee", "Ghee", Decimal("1650"), 35,
     "Premium white buffalo ghee, traditionally churned. A kitchen essential.",
     ("unsplash", "photo-1589985270826-4b7bb135bc9d", "buffalo-ghee.jpg")),
    ("Farm Butter", "Butter", Decimal("900"), 60,
     "Creamy white butter churned fresh daily. Perfect for breads and cooking.",
     ("mirror", "photo-1589985270826-4b7bb135bc9d", "farm-butter.jpg")),
    ("Aged Blue Cheese", "Cheese", Decimal("2200"), 25,
     "Bold aged blue cheese wedge for gourmet platters. Serve with figs and walnuts.",
     ("unsplash", "photo-1452195100486-9cc805987862", "blue-cheese.jpg")),
    ("Farmhouse Cheese Wheel", "Cheese", Decimal("1800"), 30,
     "Whole farmhouse cheese wheel, naturally aged for a nutty, mellow flavour.",
     ("unsplash", "photo-1486297678162-eb2a19b0a32d", "cheese-wheel.jpg")),
    ("Farm Breakfast Combo", "Cheese", Decimal("950"), 45,
     "Weekend breakfast pack: cheese, eggs, bread and milk. Serves a family of four.",
     ("unsplash", "photo-1628088062854-d1870b4553da", "breakfast-combo.jpg")),
    ("Strawberry Yogurt", "Yogurt & Curd", Decimal("180"), 80,
     "Silky set yogurt layered with fresh strawberries. Kids love it.",
     ("unsplash", "photo-1488477181946-6428a0291777", "strawberry-yogurt.jpg")),
    ("Creamy Buffalo Dahi", "Yogurt & Curd", Decimal("160"), 90,
     "Thick traditional dahi set overnight in clay pots. Tangy and probiotic-rich.",
     ("mirror", "photo-1488477181946-6428a0291777", "buffalo-dahi.jpg")),
]

CATEGORIES = [
    ("Milk", "Litre"),
    ("Ghee", "Litre"),
    ("Butter", "kg"),
    ("Cheese", "kg"),
    ("Yogurt & Curd", "kg"),
    ("Paneer", "kg"),
]


def fetch_image(kind, ref):
    """Return raw JPEG bytes for a catalog image spec."""
    if kind == "local":
        with open(os.path.join(PUBLIC_DIR, ref), "rb") as f:
            return f.read()
    url = REMOTE.format(ref)
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as r:
        data = r.read()
    if len(data) < 5000 or data[:2] != b"\xff\xd8":
        raise ValueError(f"bad image payload for {ref}")
    return data


_cache = {}


def get_image_bytes(spec):
    kind, ref, filename = spec
    if kind == "mirror":
        base = _cache.get(ref)
        if base is None:
            base = fetch_image("unsplash", ref)
            _cache[ref] = base
        im = Image.open(BytesIO(base)).convert("RGB")
        im = (ImageOps.flip(im) if "butter" in filename else ImageOps.mirror(im))
        buf = BytesIO()
        im.save(buf, "JPEG", quality=82)
        return buf.getvalue()
    data = fetch_image(kind, ref)
    if kind == "unsplash":
        _cache[ref] = data
    return data


def seed_categories():
    for name, unit in CATEGORIES:
        Category.objects.update_or_create(name=name, defaults={"unit": unit})
    print(f"categories: {Category.objects.count()}")


def seed_products():
    for name, cat_name, price, stock, desc, spec in CATALOG:
        cat = Category.objects.get(name=cat_name)
        p, created = Product.objects.update_or_create(
            product_name=name,
            defaults={"category": cat, "price": price, "stock": stock,
                      "description": desc},
        )
        import os as _os
        needs_img = (not p.picture_src) or (not _os.path.exists(p.picture_src.path))
        if needs_img:
            try:
                data = get_image_bytes(spec)
                p.picture_src.save(spec[2], ContentFile(data), save=True)
                print(f"  [img] {name}")
            except Exception as e:  # keep product even if image fails
                print(f"  [img FAIL] {name}: {e}")
        else:
            p.save()
    print(f"products: {Product.objects.count()}")


def seed_users():
    admin, _ = User.objects.update_or_create(
        username="admin",
        defaults={"email": "admin@elsadiary.com", "is_staff": True,
                  "is_superuser": True, "first_name": "Elsa", "last_name": "Admin"},
    )
    admin.set_password("Admin@123")
    admin.save()
    manager, _ = User.objects.update_or_create(
        username="manager",
        defaults={"email": "manager@elsadiary.com", "is_staff": True,
                  "first_name": "Store", "last_name": "Manager"},
    )
    manager.set_password("Manager@123")
    manager.save()
    customers = [
        ("sita", "sita@example.com", "Sita", "Sharma", "9801111111", "regular"),
        ("ram", "ram@example.com", "Ram", "Thapa", "9802222222", "occasional"),
        ("hari", "hari@example.com", "Hari", "Gurung", "9803333333", "visitor"),
    ]
    for uname, email, fn, ln, contact, utype in customers:
        u, _ = User.objects.update_or_create(
            username=uname,
            defaults={"email": email, "first_name": fn, "last_name": ln},
        )
        u.set_password("Customer@123")
        u.save()
        Profile.objects.filter(user=u).update(contact=contact, user_type=utype)
    print(f"users: {User.objects.count()}")


def seed_company():
    CompanyConfiguration.objects.update_or_create(
        pk=1,
        defaults={
            "company_name": "Elsa Dairy Pvt. Ltd.",
            "office_address": "Lakeside, Pokhara, Kaski, Nepal",
            "contact_phone": "+977 980-0000000",
            "system_sender_email": "order@elsadiary.com",
            "system_password": "demo-app-password",
            "support_email": "hello@elsadiary.com",
            "facebook_url": "https://facebook.com/elsadiary",
            "instagram_url": "https://instagram.com/elsadiary.official",
            "tiktok_url": "https://tiktok.com/@elsadiary.official",
        },
    )
    print("company: 1")


def seed_contacts():
    rows = [
        ("Anita Karki", "anita@example.com", "Bulk ghee order",
         "Namaste, I need 10 litres of cow ghee for a wedding next month. Do you offer bulk discounts?",
         "Quoted bulk rate on phone.", "resolved"),
        ("Bikash Rai", "bikash@example.com", "Delivery delay in Lakeside",
         "My milk subscription did not arrive yesterday morning. Please check.",
         "", "new"),
        ("Sunita Adhikari", "sunita@example.com", "Paneer availability",
         "Is fresh paneer available daily? I run a small restaurant and need 5kg every morning.",
         "Added to daily B2B delivery list.", "resolved"),
        ("Dipesh Shrestha", "dipesh@example.com", "Damaged cheese pack",
         "One cheese pack arrived open. Order ORD-1004. Requesting replacement.",
         "", "new"),
    ]
    for full_name, email, subject, message, note, status in rows:
        Contact.objects.update_or_create(
            email=email, subject=subject,
            defaults={"full_name": full_name, "message": message,
                      "admin_note": note or None, "status": status},
        )
    print(f"contacts: {Contact.objects.count()}")


def seed_feedbacks():
    rows = [
        ("sita", "sita@example.com", "PRODUCT",
         "The cow milk is so fresh, my tea tastes amazing every morning!", True),
        ("ram", "ram@example.com", "DELIVERY",
         "Delivery reached 30 minutes late twice this week in Baneshwor.", False),
        ("hari", "hari@example.com", "PRICE",
         "Buffalo ghee price feels a bit high compared to the local market.", False),
        ("Anita Karki", "anita@example.com", "SUGGESTION",
         "Please add chocolate-flavoured yogurt for kids. Would buy weekly!", False),
        ("Bikash Rai", "bikash@example.com", "OTHER",
         "Website checkout with eSewa was smooth. Thank you!", True),
    ]
    for username, email, topic, text, reviewed in rows:
        Feedback.objects.update_or_create(
            email=email, feedback_topic=topic,
            defaults={"username": username, "feedback": text,
                      "is_reviewed": reviewed},
        )
    print(f"feedbacks: {Feedback.objects.count()}")


def make_order(full_name, email, phone, location, otype, items, dstatus,
               ostatus, note=""):
    """items: [(product_name, qty)]. Totals computed like the API does."""
    fee = Decimal("100")
    total = fee
    order, _ = Order.objects.update_or_create(
        email=email, full_name=full_name, location=location,
        order_type=otype, order_status=ostatus,
        defaults={"contact_number": phone, "delivery_fee": fee,
                  "delivery_status": dstatus, "order_type": otype,
                  "order_status": ostatus, "admin_note": note or None,
                  "total_amount": Decimal("0")},
    )
    order.items.all().delete()
    for pname, qty in items:
        prod = Product.objects.get(product_name=pname)
        OrderItem.objects.create(
            order=order, product=prod, product_name=prod.product_name,
            quantity=qty, unit=prod.category.unit,
            price_at_purchase=prod.price,
        )
        total += prod.price * qty
    order.total_amount = total
    order.save(update_fields=["total_amount"])
    return order


def seed_orders():
    Order.objects.all().delete()
    make_order("Sita Sharma", "sita@example.com", "9801111111",
               "Baneshwor, Kathmandu", "eSewa",
               [("Fresh Cow Milk", 4), ("Creamy Buffalo Dahi", 2)],
               "success", "accepted")
    make_order("Sita Sharma", "sita@example.com", "9801111111",
               "Baneshwor, Kathmandu", "Cash",
               [("Farm Butter", 1), ("Strawberry Yogurt", 3)],
               "pending", "pending")
    make_order("Ram Thapa", "ram@example.com", "9802222222",
               "Lakeside, Pokhara", "Cash",
               [("Buffalo Milk", 5), ("Pure Cow Ghee", 1)],
               "delivering", "accepted")
    make_order("Hari Gurung", "hari@example.com", "9803333333",
               "Chipledhunga, Pokhara", "eSewa",
               [("Aged Blue Cheese", 1)],
               "pending", "rejected",
               note="Payment screenshot unclear, asked to reorder.")
    make_order("Anita Karki", "anita@example.com", "9841111111",
               "Boudha, Kathmandu", "Cash",
               [("Farmhouse Cheese Wheel", 1), ("Farm Breakfast Combo", 2)],
               "success", "resolved")
    print(f"orders: {Order.objects.count()}, items: {OrderItem.objects.count()}")


def seed_cart():
    Cart.objects.all().delete()
    sita = User.objects.get(username="sita")
    for pname, qty in [("Fresh Cow Milk", 2), ("Strawberry Yogurt", 1)]:
        Cart.objects.create(user=sita,
                            product=Product.objects.get(product_name=pname),
                            quantity=qty)
    print(f"cart rows: {Cart.objects.count()}")


if __name__ == "__main__":
    seed_categories()
    seed_products()
    seed_users()
    seed_company()
    seed_contacts()
    seed_feedbacks()
    seed_orders()
    seed_cart()
    print("SEED DONE")
