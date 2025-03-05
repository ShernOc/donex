from app import create_app, db  
from models import Charity  
from werkzeug.security import generate_password_hash  

def seed_charities():
    charities = [
        {
            "email": "info@unicef.org",
            "charity_name": "UNICEF",
            "description": "Supporting children's education, healthcare, and protection worldwide.",
            "approved": "approved",
            "password": "unicef123",
            "user_id": 1,
            "profile_picture": "backend/images/unicef.png"
        },
        {
            "email": "contact@redcross.org",
            "charity_name": "Red Cross",
            "description": "Providing disaster relief, emergency assistance, and health services globally.",
            "approved": "approved",
            "password": "redcross456",
            "user_id": 2,
            "profile_picture": "backend/images/redcross.png"
        },
        {
            "email": "support@oxfam.org",
            "charity_name": "Oxfam",
            "description": "Fighting global poverty and advocating for social justice.",
            "approved": "approved",
            "password": "oxfam789",
            "user_id": 3,
            "profile_picture": "backend/images/Oxfam_logo_vertical.svg.png"
        },
        {
            "email": "donate@savethechildren.org",
            "charity_name": "Save the Children",
            "description": "Improving children's lives through education, healthcare, and nutrition.",
            "approved": "pending",
            "password": "savethekids123",
            "user_id": 4,
            "profile_picture": "backend/images/save.png"
        },
        {
            "email": "hello@doctorswithoutborders.org",
            "charity_name": "Doctors Without Borders",
            "description": "Providing medical aid in conflict zones and disaster areas worldwide.",
            "approved": "approved",
            "password": "medic456",
            "user_id": 5,
            "profile_picture": "backend/images/doctors.png"
        },
        {
            "email": "info@wwf.org",
            "charity_name": "World Wildlife Fund (WWF)",
            "description": "Working to conserve nature and reduce threats to biodiversity.",
            "approved": "approved",
            "password": "wildlife789",
            "user_id": 6,
            "profile_picture": "backend/images/wwf.png"
        },
        {
            "email": "contact@water.org",
            "charity_name": "Water.org",
            "description": "Providing clean and safe water to people in need.",
            "approved": "pending",
            "password": "waterlife123",
            "user_id": 7,
            "profile_picture": "backend/images/water.png"
        },
        {
            "email": "team@feedingamerica.org",
            "charity_name": "Feeding America",
            "description": "Helping fight hunger and food insecurity in the U.S.",
            "approved": "approved",
            "password": "hunger456",
            "user_id": 8,
            "profile_picture": "backend/images/feedinga.png"
        },
        {
            "email": "support@habitat.org",
            "charity_name": "Habitat for Humanity",
            "description": "Building homes and providing shelter for families in need.",
            "approved": "approved",
            "password": "homes789",
            "user_id": 9,
            "profile_picture": "backend/images/habitat.png"
        },
        {
            "email": "info@amnesty.org",
            "charity_name": "Amnesty International",
            "description": "Campaigning for human rights and social justice worldwide.",
            "approved": "approved",
            "password": "justice123",
            "user_id": 10,
            "profile_picture": "backend/images/amnesty.png"
        }
    ]

    for charity_data in charities:
        charity = Charity(
            email=charity_data["email"],
            charity_name=charity_data["charity_name"],
            description=charity_data["description"],
            approved=charity_data["approved"],
            user_id=charity_data["user_id"],
            password=generate_password_hash(charity_data["password"]),  
            profile_picture=charity_data["profile_picture"]  
        )
        db.session.add(charity)

    db.session.commit()
    print("Seed data inserted successfully!")

if __name__ == "__main__":
    app = create_app()  
    with app.app_context():
        db.create_all()
        seed_charities()
