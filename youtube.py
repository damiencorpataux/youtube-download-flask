import pytube, requests

# this module should be able to extract audio only

class NotFoundError(Exception):
    pass
class InvalidIdError(Exception):
    pass

def isvalid(id):
    return gdata(id).status_code == 200

def ensurevalid(id):
    status = gdata(id).status_code
    if status == 404:
        raise NotFoundError('Video %s does not exist' %id)
    if status == 400:
        raise InvalidIdError('Video %s is invalid' %id)

def gdata(id):
    url = 'http://gdata.youtube.com/feeds/api/videos/%s' %id
    return requests.get(url) #FIXME: for now...

def _yt(id):
    ensurevalid(id)
    yt = pytube.YouTube()
    yt.url = "http://www.youtube.com/watch?v=%s" %id
    return yt

def video(id, resolution=None, extension=None):
    yt = _yt(id)
    return {
        'id': yt.video_id,
        'title': yt.title,
        'url': yt.url,
        'filename': yt.filename,
        'streams': sorted([vars(v) for v in yt.filter(extension, resolution)],
                          reverse=True,
                          key=lambda x: (x.get('resolution'),
                                        x.get('extension')))
    }

def stream_url(id, resolution=None, extension=None):
    """
    Returns the best possible video stream url
    according the given parameters.
    """
    try:
        stream = video(id, resolution, extension)['streams'][0]
    except IndexError:
        raise NotFoundError('No stream matching %s for video %s'
                            %('/'.join([resolution,extension]), id))
    return {'url': stream['url'],
            'filename': stream['filename']+'.'+stream['extension']}
