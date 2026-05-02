from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings


def send_custom_mail(subject, recipient_email, template_name, context, attachment=None):
    try:
        context['subject']= subject
        html_content= render_to_string(f"account/email/{template_name}",context)
        text_content= strip_tags(html_content)
        email= EmailMultiAlternatives(
            subject=subject,
            body= text_content,
            from_email= settings.DEFAULT_FROM_EMAIL,
            to= [recipient_email]

        )
        email.attach_alternative(html_content, 'text/html')
        if attachment:
             email.attach(attachment.name, attachment.read(), attachment.content_type)
        email.send()
        return True
    except Exception as e:
        print(str(e))
        return False
    

    

        
