import flask, youtube, requests

app = flask.Flask(__name__)


@app.route('/')
def home():
    return flask.render_template('home.html')

@app.route('/api/search/<id>')
def search_by_id(id):
    return flask.jsonify({
        'error': None,
        'data': youtube.videos(id)
    })

@app.route('/download/<id>/')
@app.route('/download/<id>/<resolution>/')
@app.route('/download/<id>/<resolution>/<extension>/')
def download_by_id(id, resolution=None, extension=None):
    stream = youtube.streamurl(id, resolution, extension)
    binary = requests.get(stream['url'], stream=True)
    return flask.Response(
        binary,
        headers={'Content-Disposition': 'attachment; '
                                        'filename='+stream['filename']})

@app.errorhandler(Exception)
def error(e):
    #FIXME: this is not catching anyting
    if False:#app.debug:
        raise
    else:
        return flask.jsonify({'error': str(e)})


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
