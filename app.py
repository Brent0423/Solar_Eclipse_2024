from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    # This function renders the homepage template
    return render_template('index.html')

# Add any additional routes as needed

if __name__ == '__main__':
    # This condition checks if the script is being run directly and starts the Flask server
    app.run(debug=True)
