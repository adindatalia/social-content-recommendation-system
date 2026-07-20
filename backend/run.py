from app import create_app, db

app = create_app()

if __name__ == "__main__":
    with app.app_context():
        # Create database tables if they do not exist
        db.create_all()
        print("Database tables initialized successfully.")
        
    app.run(host="0.0.0.0", port=5000, debug=True)
