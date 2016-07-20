from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render_to_response
from django.template  import RequestContext
from django.core.mail import send_mail
#from pytz.gae import pytz
from datetime import datetime
#from django.utils import simplejson as json
import urllib, urllib2, re
import logging


class PartPdf(file):
  def __init__(self, pFilename, pPdfKey, pRequest, *args, **kwargs):
    self.filename = pFilename
    self.filepath = "%s/%s" % (settings.PDF_FILE_PATH, self.filename)
    self.request = pRequest
    self.key = pPdfKey

    lStampedFilepath = self.stamp_pdf()
    super(PartPdf, self).__init__(lStampedFilepath, *args, **kwargs)

  def stamp_pdf(self):
    """
    Stamp pdf with current username
    """
    # extract metadata
    lUsername = self.request.user.username
    lMetaDataFilename = "/tmp/%s_%s.metadata" % (self.filename, lUsername)
    lCommand = "pdftk %s dump_data output %s" % (self.filepath, lMetaDataFilename)  
    os.system(lCommand)

    lMetaDataFile = open(lMetaDataFilename, "a")
    lMetaDataFile.write("InfoKey: user\n")
    lMetaDataFile.write("InfoValue: %s\n" % lUsername)
    lMetaDataFile.close()

    lOutputFilename = "/tmp/%s_%s" % (self.filename, lUsername)
    lCommand = "pdftk %s update_info %s output %s owner_pw PASSWORD allow printing" % (self.filepath, lMetaDataFilename, lOutputFilename)  
    os.system(lCommand)

  def close(self):
    """
    File has completed downloading so log it
    """
    super(PartPdf, self).close()
    lCounter = PdfDownloadLog()
    lCounter.user = self.request.user
    lCounter.ip = self.request.META['REMOTE_ADDR']
    lCounter.user_agent = self.request.META['HTTP_USER_AGENT']
    lDownloadKey = PdfDownloadKey.objects.filter(key=self.key)[0]
    if lDownloadKey.downloads_available > 0:
      lDownloadKey.downloads_available -= 1
      lDownloadKey.save()
    lCounter.key = lDownloadKey
    lCounter.save()

    lStampedFilepath = "/tmp/%s_%s" % (self.filename, self.request.user.username)
    os.remove(lStampedFilepath)
    os.remove("%s.metadata" % lStampedFilepath)




def frontpage(request):
  return render_to_response('mainapp/frontpage.html', {}, context_instance=RequestContext(request))

def resume(request):
  return render_to_response('mainapp/resume.html', {}, context_instance=RequestContext(request))

def currentResume(request):
  return render_to_response('mainapp/EricSchlossbergCountertenor.html')

def currentRep2(request):
  return render_to_response('mainapp/replist2.html')

def currentRep(request):
  return render_to_response('mainapp/replist.html')
  
def tweets(request):
  return render_to_response('mainapp/tweets.html', {}, context_instance=RequestContext(request))

def bio(request):
  return render_to_response('mainapp/bio.html', {}, context_instance=RequestContext(request))

def media(request):
  return render_to_response('mainapp/media.html', {}, context_instance=RequestContext(request))

def photos(request):
  return render_to_response('mainapp/photos.html', {}, context_instance=RequestContext(request))

def calendar(request):
  return render_to_response('mainapp/calendar.html', {}, context_instance=RequestContext(request))

def comments(request):
  return render_to_response('mainapp/comments.html', {}, context_instance=RequestContext(request))

def robots(request):
  return render_to_response('robots.txt', {}, context_instance=RequestContext(request))

DATETIME_FORMAT_INPUT = '%Y-%m-%dT%H:%M:%SZ'
DATETIME_FORMAT_OUTPUT = '%Y-%m-%dT%H:%M:%S'

'''
def getEvents(request):
  get_data = urllib.urlencode({'orderBy': 'startTime',
                               'singleEvents': 'true',
                               'key': 'AIzaSyC5s4JA1EUFuPQH-tTb0ko-EhLNOuHItN0'
                               })
  url = 'https://www.googleapis.com/calendar/v3/calendars/hapbikfbm1pafudtrp47e56l3s@group.calendar.google.com/events'
  result = urllib2.urlopen(url+'?'+get_data)
  content = result.read()
  contentObject = json.loads(content)
  
  #cleanup
  if 'kind' in contentObject: del contentObject['kind']
  if 'etag' in contentObject: del contentObject['etag']
  if 'summary' in contentObject: del contentObject['summary']
  if 'description' in contentObject: del contentObject['description']
  if 'updated' in contentObject: del contentObject['updated']
  if 'timeZone' in contentObject: del contentObject['timeZone']
  if 'accessRole' in contentObject: del contentObject['accessRole']
  
  for item in contentObject['items']:
    #cleanup
    if 'kind' in item: del item['kind']
    if 'etag' in item: del item['etag']
    if 'id' in item: del item['id']
    if 'status' in item: del item['status']
    if 'created' in item: del item['created']
    if 'updated' in item: del item['updated']
    if 'creator' in item: del item['creator']
    if 'organizer' in item: del item['organizer']
    if 'end' in item: del item['end']
    if 'transparency' in item: del item['transparency']
    if 'sequence' in item: del item['sequence']
    if 'iCalUID' in item: del item['iCalUID']
    
    if 'start' in item and 'dateTime' and 'timeZone' in item['start']:
      #timezone stuff
      start = item['start']
      logging.info("DT: " +start['dateTime'])
      dt = re.sub(r'[-|\+]..:..*$', '', start['dateTime'])
      dt = datetime.strptime(dt, DATETIME_FORMAT_INPUT)
      dt = dt.replace(tzinfo=pytz.utc)
      dt = dt.astimezone(pytz.timezone(start['timeZone']))
      start['dateTime'] = dt.strftime(DATETIME_FORMAT_OUTPUT)
      start['abbr'] = dt.tzname()
      del start['timeZone']
  return HttpResponse(json.dumps(contentObject), mimetype='application/json') 
'''

def contact(request):
  return render_to_response('mainapp/contact.html', {}, context_instance=RequestContext(request))
  