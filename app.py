from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    # Render the homepage template
    return render_template('index.html')

# Add any additional routes as needed

if __name__ == '__main__':
    app.run(debug=True)
