from app import create_app, db, app 
from models import Charity, Story 
from werkzeug.security import generate_password_hash  

def seed_charities():
    charities = [
        {
            "email": "info@unicef.org",
            "charity_name": "UNICEF",
            "description": "Supporting children's education, healthcare, and protection worldwide.",
            "status": "approved",
            "password": "unicef123",
            "user_id": 1,
            "profile_picture": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Logo_of_UNICEF.svg/330px-Logo_of_UNICEF.svg.png"
        },
        {
            "email": "contact@redcross.org",
            "charity_name": "Red Cross",
            "description": "Providing disaster relief, emergency assistance, and health services globally.",
            "status": "approved",
            "password": "redcross456",
            "user_id": 2,
            "profile_picture": "https://www.redcross.or.ke/wp-content/uploads/2025/02/at-60-logo-203x114-1.png.webp"
        },
        {
            "email": "support@oxfam.org",
            "charity_name": "Oxfam",
            "description": "Fighting global poverty and advocating for social justice.",
            "status": "approved",
            "password": "oxfam789",
            "user_id": 3,
            "profile_picture": "https://upload.wikimedia.org/wikipedia/en/thumb/3/35/Oxfam_logo_vertical.svg/225px-Oxfam_logo_vertical.svg.png"
        },
        {
            "email": "donate@savethechildren.org",
            "charity_name": "Save the Children",
            "description": "Improving children's lives through education, healthcare, and nutrition.",
            "status": "pending",
            "password": "savethekids123",
            "user_id": 4,
            "profile_picture": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Save_the_Children_Logo.svg/330px-Save_the_Children_Logo.svg.png"
        },
        {
            "email": "hello@doctorswithoutborders.org",
            "charity_name": "Doctors Without Borders",
            "description": "Providing medical aid in conflict zones and disaster areas worldwide.",
            "status": "approved",
            "password": "medic456",
            "user_id": 5,
            "profile_picture":"https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Logo_of_UNICEF.svg/1024px-Logo_of_UNICEF.svg.png"
        },
        
        
        {
            "email": "info@wwf.org",
            "charity_name": "World Wildlife Fund (WWF)",
            "description": "Working to conserve nature and reduce threats to biodiversity.",
            "status": "approved",
            "password": "wildlife789",
            "user_id": 6,
            "profile_picture": "https://upload.wikimedia.org/wikipedia/en/thumb/2/24/WWF_logo.svg/188px-WWF_logo.svg.png"
        },
        {
            "email": "contact@water.org",
            "charity_name": "Water.org",
            "description": "Providing clean and safe water to people in need.",
            "status": "pending",
            "password": "waterlife123",
            "user_id": 7,
            "profile_picture":"https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Water.org_logo.png_updated.png/330px-Water.org_logo.png_updated.png"
        },
        {
            "email": "team@feedingamerica.org",
            "charity_name": "Feeding America",
            "description": "Helping fight hunger and food insecurity in the U.S.",
            "status": "approved",
            "password": "hunger456",
            "user_id": 8,
            "profile_picture":"https://upload.wikimedia.org/wikipedia/en/thumb/a/aa/Feeding_America_logo.svg/330px-Feeding_America_logo.svg.png"
        },
        {
            "email": "support@habitat.org",
            "charity_name": "Habitat for Humanity",
            "description": "Building homes and providing shelter for families in need.",
            "status": "approved",
            "password": "homes789",
            "user_id": 9,
            "profile_picture": "https://upload.wikimedia.org/wikipedia/en/thumb/9/97/Habitat_for_humanity.svg/330px-Habitat_for_humanity.svg.png"
        },
        {
            "email": "info@amnesty.org",
            "charity_name": "Amnesty International",
            "description": "Campaigning for human rights and social justice worldwide.",
            "status": "approved",
            "password": "justice123",
            "user_id": 10,
            "profile_picture": "https://upload.wikimedia.org/wikipedia/en/thumb/e/ee/Amnesty_International_logo.svg/375px-Amnesty_International_logo.svg.png"
        }
    ]

    for charity_data in charities:
        charity = Charity(
            email=charity_data["email"],
            charity_name=charity_data["charity_name"],
            description=charity_data["description"],
            status=charity_data["status"],
            user_id=charity_data["user_id"],
            password=generate_password_hash(charity_data["password"]),  
            profile_picture=charity_data["profile_picture"]  
        )
        db.session.add(charity)
        db.session.commit()
        print("Seed data inserted successfully!")

        
def seed_stories():
    stories = [
    {
    "user_id": 1,
     "title":"A New Beginning for Sarah's Family",
     "charity_id":8,
      "content":"Thanks to generous donors, Sarah's family received the support they needed during a difficult time...",
    #   "date": "March 15, 2024",
      "image":"https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&w=800&q=80",
    },

    
    {
     "user_id": 2,
      "title":"Building Schools in Rural Communities",
      "charity_id":5,
      "content":"With your support, we've built 3 new schools reaching over 500 children in remote areas...",
    #   "date":"March 12, 2024",
      "image":"https://images.unsplash.com/photo-1497633762265-9d179a990aa6?ixlib=rb-4.0.3&w=800&q=80",
    },
    {
      "user_id": 3,
      "charity_id":4,
      "title":"Clean Water Initiative Success",
      "content":"Our latest water purification project has provided clean drinking water to over 1,000 families...",
    #   "date":"March 06, 2024",
      "image":"https://images.unsplash.com/photo-1512578659172-63a4634c05ec?ixlib=rb-4.0.3&w=800&q=80",
      
    },
  ]
    
    for story_data in stories:
        story = Story(
            content=story_data["content"],
            title=story_data["title"],
            user_id=story_data["user_id"],
            charity_id=story_data["charity_id"],
            # date=story_data["date"],
            image=story_data["image"]
        )
        
        db.session.add(story)
        db.session.commit()
        print("Seed data inserted successfully!")

if __name__ == "__main__":
    app = create_app()  
    with app.app_context():
        db.create_all()
        seed_charities()
        seed_stories()
