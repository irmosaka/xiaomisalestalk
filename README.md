# Xiaomi Sales Talk — Internal Retail Product Playbook

نسخه توسعه‌ای 0.2 برای آموزش محصول و کمک به مکالمه فروش در نقطه فروش. رابط فارسی و واکنش‌گراست و خانواده‌های محصول را به‌جای تکرار محتوا برای هر رنگ/EAN نمایش می‌دهد.

## محتویات
- `products.json`: شناسه و نام SKU، برند، EAN و دسته‌بندی پاک‌سازی‌شده؛ فاقد قیمت، بهای تمام‌شده و موجودی است.
- `families.json`: گروه‌بندی محصول در سطح خانواده و مدل.
- `playbooks.json`: راهنمای فروش مستند برای 11 خانواده منتخب Xiaomi.
- `sources.md`: منابع رسمی استفاده‌شده و یادداشت راستی‌آزمایی.

## راه‌اندازی محلی
فایل‌ها را در یک وب‌سرور استاتیک اجرا کنید؛ به دلیل استفاده از `fetch()`، باز کردن مستقیم `index.html` با `file://` مناسب نیست. برای تست، از یک HTTP server محلی استفاده کنید.

## امنیت و انتشار داخلی — مهم
این برنامه احراز هویت داخلی ندارد و عمداً هیچ رمز عبور ثابت یا کنترل دسترسی سمت مرورگر در آن تعبیه نشده است؛ چنین روشی امنیت واقعی ایجاد نمی‌کند. آن را فقط پشت VPN/SSO یا reverse proxy سازمانی منتشر کنید. اطلاعات قیمت خرید، قیمت بازار و موجودی از داده منتشرشده حذف شده‌اند.

مخزن فعلی `irmosaka/xiaomisalestalk` باید Private شود؛ اما Private شدن مخزن به‌تنهایی، GitHub Pages را در همه پلن‌ها به سایت داخلی تبدیل نمی‌کند. انتشار خصوصی Pages برای اعضای سازمان به GitHub Enterprise Cloud نیاز دارد. در پلن‌های عادی، Pages ممکن است عمومی بماند یا هنگام تبدیل مخزن به Private از انتشار خارج شود.

مستندات رسمی: [Repository visibility](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/managing-repository-settings/setting-repository-visibility) · [Privately published GitHub Pages](https://docs.github.com/en/enterprise-cloud@latest/pages/getting-started-with-github-pages/about-privately-published-github-pages-sites) · [GitHub Pages availability](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

## محدوده محتوای این نسخه
راهنماهای مستند فعلاً برای 11 خانواده منتخب Xiaomi تهیه شده‌اند. برای بقیه مدل‌ها، محتوا عمداً Pending باقی مانده تا پس از بررسی صفحه رسمی همان مدل و نسخه منطقه‌ای تکمیل شود. مشخصات بازارهای مختلف ممکن است تفاوت داشته باشند؛ نسخه روی جعبه و منبع رسمی همان SKU باید کنترل شود.
