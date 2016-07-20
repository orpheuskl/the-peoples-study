from django.conf.urls import url, patterns
from django.conf import settings
from django.conf.urls.static import static
from settings import DEBUG

urlpatterns = patterns('mainapp.views',
  (r'^$', 'frontpage'),
  (r'^resume$', 'resume'),
  (r'^currentResume$', 'currentResume'),
  (r'^currentRep$', 'currentRep'),
  (r'^currentRep2$', 'currentRep2'),
  (r'^tweets$', 'tweets'),
  (r'^bio$', 'bio'),
  (r'^media$', 'media'),
  (r'^photos$', 'photos'),
  (r'^calendar$', 'calendar'),
  (r'^comments$', 'comments'),
  (r'^contact$', 'contact'),
  (r'^getEvents$', 'getEvents'),
  (r'^robots\.txt$', 'robots'),
)

if DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)