from flask import Flask, render_template, jsonify, request
from os.path import exists, abspath, join, expanduser, isdir, isfile, islink
from os import listdir
from re import match

app = Flask(__name__, template_folder="./templates", static_folder="./assets")


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/api/checkpath", methods=["POST"])
def checkpath():
    req_path: str = request.json["path"]
    if match(r"^~\/.*", req_path):
        req_path = req_path.replace("~", expanduser("~"))
        print(req_path)
    # sub()
    if exists(req_path) and isdir(req_path):
        contents = []
        files = [file for file in listdir(req_path) if not file.startswith(".")]
        for file in files:
            if isdir(join(req_path, file)):
                contents.append({"name": file, "type": "dir"})
            elif isfile(join(req_path, file)):
                contents.append({"name": file, "type": "file"})
            else:
                contents.append({"name": file, "type": "link"})
        return jsonify({"pathValid": True, "contents": contents})
    else:
        return jsonify({"pathValid": False})


if __name__ == "__main__":
    app.run(debug=True)
