import flask, youtube, requests

app = flask.Flask(__name__)


@app.route('/')
def home():
    return flask.render_template('home.html')

@app.route('/api/search/<id>')
def search_by_id(id):
    try:
        return flask.jsonify({
            'error': None,
            'data': youtube.video(id)
        })
    except Exception, e:
        raise ApiException(e)
    
@app.route('/download/<id>/')
@app.route('/download/<id>/<resolution>/')
@app.route('/download/<id>/<resolution>/<extension>/')
def download_by_id(id, resolution=None, extension=None):
    stream = youtube.stream_url(id, resolution, extension)
    binary = requests.get(stream['url'], stream=True)
    return flask.Response(
        binary,
        headers={'Content-Disposition': 'attachment; '
                                        'filename='+stream['filename']})

class ApiException(Exception):
    pass

@app.errorhandler(ApiException)
def error(e):
    return flask.jsonify({'error': str(e)}), 404

@app.errorhandler(Exception)
def error(e):
    #FIXME: a decorator to avoid having to place a try/except block
    #       around each api function (eg. search_by_id)
    if app.debug:
        raise  # triggers werkzeug debugger
    else:
        #FIXME: template this
        return ('<h1><strong>404 - </strong>'
               'Something went wrong, sorry.</h1>')


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
