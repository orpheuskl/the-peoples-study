import re, logging
from django.utils.translation import activate

LANGUAGE_UNSPECIFIC_DOMAINS = [
    'www',
    'ericschlossberg',
    'localhost',
]

class CustomLanguage():
    def process_request(self, request):
        domain = request.META.get('HTTP_HOST', '')
        domains = domain.split('.')
        lang = domains[0]
        if lang not in LANGUAGE_UNSPECIFIC_DOMAINS:
            activate(lang)
