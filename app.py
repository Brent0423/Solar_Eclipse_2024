import os
from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    # This function renders the homepage template
    return render_template('index.html')

# Add any additional routes as needed

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))  # Use port provided by Heroku or default to 5000
    app.run(host="0.0.0.0", port=port)
