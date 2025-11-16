DROP TABLE IF EXISTS adoption_requests CASCADE;
DROP TABLE IF EXISTS pet_images CASCADE;
DROP TABLE IF EXISTS pets CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
                       id SERIAL PRIMARY KEY,
                       name VARCHAR(100) NOT NULL,
                       email VARCHAR(150) UNIQUE NOT NULL,
                       password VARCHAR(200) NOT NULL,
                       role VARCHAR(20) NOT NULL,           -- 'ADOPTER' or 'SHELTER'
                       address VARCHAR(255),
                       phone VARCHAR(20)
);

CREATE TABLE pets (
                      id SERIAL PRIMARY KEY,
                      name VARCHAR(100) NOT NULL,
                      type VARCHAR(50) NOT NULL,           -- Dog, Cat, Bird...
                      breed VARCHAR(100),
                      age INT,
                      description TEXT,
                      location VARCHAR(100),
                      status VARCHAR(20) DEFAULT 'Available',
                      owner_id INT NOT NULL,
                      CONSTRAINT fk_pet_owner
                          FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE pet_images (
                            id SERIAL PRIMARY KEY,
                            pet_id INT NOT NULL,
                            image_url TEXT NOT NULL,
                            CONSTRAINT fk_images_pet
                                FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE
);

CREATE TABLE adoption_requests (
                                   id SERIAL PRIMARY KEY,
                                   adopter_id INT NOT NULL,
                                   pet_id INT NOT NULL,
                                   message TEXT,
                                   status VARCHAR(20) DEFAULT 'Pending',
                                   request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                                   CONSTRAINT fk_request_adopter
                                       FOREIGN KEY (adopter_id) REFERENCES users(id) ON DELETE CASCADE,

                                   CONSTRAINT fk_request_pet
                                       FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE
);
