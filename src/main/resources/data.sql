-- USERS
INSERT INTO users (name, email, password, role, address, phone)
VALUES
    ('Happy Paws Shelter', 'shelter@pets.com', 'pass123', 'SHELTER', '123 Shelter Street', '0712345678'),
    ('Ionut B', 'ionut@adopter.com', 'pass123', 'ADOPTER', 'Str. Libertatii 10', '0711111111');

-- PETS
INSERT INTO pets (name, type, breed, age, description, location, status, owner_id)
VALUES
    ('Bella', 'Dog', 'Labrador', 3, 'Friendly and playful', 'Bucharest', 'Available', 1),
    ('Misu', 'Cat', 'European Shorthair', 2, 'Calm and affectionate', 'Cluj', 'Available', 1);

-- PET IMAGES
INSERT INTO pet_images (pet_id, image_url)
VALUES
    (1, 'https://example.com/bella1.jpg'),
    (1, 'https://example.com/bella2.jpg'),
    (2, 'https://example.com/misu1.jpg');
