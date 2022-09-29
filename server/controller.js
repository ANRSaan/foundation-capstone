require('dotenv').config()
const Sequelize = require('sequelize')

const {CONNECTION_STRING} = process.env

const sequelize = new Sequelize(CONNECTION_STRING, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
        rejectUnauthorized: false
        }
    }
})

module.exports = {

    createUser: (req, res) => {
        const {username} = req.body
        sequelize.query(`
            INSERT INTO users (name)
            VALUES ('${username}');
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => console.log(err))
    },

    deleteUser: (req, res) => {
        const {username} = req.params
        sequelize.query(`
            SELECT user_id AS @uid FROM users
            WHERE username = '${username}';

            DELETE FROM users
            WHERE username = ${username};

            DELETE FROM cards_to_decks
            JOIN decklists
            ON decklists.decklist_id = cards_to_decks.decklist_id
            WHERE decklist.user_id = @uid;

            DELETE FROM decklists
            WHERE user_id = @uid;
        `)
        .then(() =>  res.status(200).send())
        .catch(err => console.log(err))
    },

    createDeck: (req, res) => {
        const {decklistName, cardNames, username} = req.body
        sequelize.query(`
            INSERT INTO decklists (user_id, name)
            VALUES (
                (SELECT user_id 
                FROM users 
                WHERE username = '${username}'), 
                '${decklistName});
        `)
        .then(() => res.status(200).send())
        .catch(err => console.log(err))

        for (i=0; i < cardNames.length; i++){
            let card = cardNames[i]
            
            sequelize.query(`
                SELECT decklist_id INTO @did FROM decklists
                WHERE name = '${decklistName}';
            
                SELECT card_id INTO @cid FROM cards
                WHERE name = '${card}';

                INSERT INTO cards_to_decks (decklist_id, card_id)
                VALUES (@did, @cid);
                
            `)
            .then(() => res.status(200).send())
            .catch(err => console.log(err))
            
        }
        

    },

    getDeck: (req, res) => {
        const {decklistName} = req.body
        sequelize.query(`
            SELECT * FROM cards AS c
            JOIN cards_to_decks AS ctd
            ON c.card_id = ctd.card_id
            JOIN decklist AS d
            ON d.decklist_id = ctd.decklist_id
            WHERE d.name = '${decklistName}';
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => console.log(err))
    },

    deleteDeck: (req, res) => {
        const {decklistName} = req.params
        sequelize.query(`
            SELECT decklist_id AS @did FROM decklists
            WHERE name = '${decklistName}';

            DELETE FROM users
            WHERE decklist_id = @did;

            DELETE FROM decklists
            WHERE decklist_id = @did;

            DELETE FROM cards_to_decks
            WHERE decklist_id = @did;
        `)
        .then(() => res.status(200).send())
        .catch(err => console.log(err))

    },

    modifyDeck: (req, res) => {
        const {decklistName, adds, deletes} = req.params

        for (i = 0; i < deletes.length; i++){
            let card = deletes[i]
            sequelize.query(`
                SELECT card_id AS @cid FROM cards
                WHERE name = '${card}';

                DELETE FROM cards_to_decks
                WHERE card_id = @cid;
            `)
            .then(() => res.status(200).send())
            .catch(err => console.log(err))
        }

        for (i = 0; i < adds.length; i++){
            let card = adds[i]
            sequelize.query(`
                SELECT decklist_id AS did FROM decklist
                WHERE name = '${decklistName}';

                SELECT card_id AS @cid FROM card
                WHERE name = '${card}';

                INSERT INTO cards_to_decks (decklist_id, card_id)
                VALUES (@did, @cid);
            `)
            .then(() => res.status(200).send())
            .catch(err => console.log(err))
        }
        
    },

    seed: (req, res) => {
        sequelize.query(`
        DROP TABLE IF EXISTS cards_to_decks;
        DROP TABLE IF EXISTS cards;
        DROP TABLE IF EXISTS users;
        DROP TABLE IF EXISTS decklists;

        CREATE TABLE users (
            user_id SERIAL PRIMARY KEY,
            username VARCHAR(20)
        );

        CREATE TABLE decklist (
            decklist_id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users,
            name VARCHAR(50)
        );

        

        CREATE TABLE card (
            card_id SERIAL PRIMARY KEY,
            name VARCHAR(60),
            type VARCHAR(40),
            cost INTEGER,
            influence INTEGER,
            faction VARCHAR(20),
            strength INTEGER,
            memory INTEGER,
            influence_limit INTEGER,
            deck_size INTEGER

        );

        CREATE TABLE cards_to_decks (
            ctd_id SERIAL PRIMARY KEY,
            decklist_id INTEGER REFERENCES decklist,
            card_id INTEGER REFERENCES card
        );

        INSERT INTO card (name, type, cost, influence, faction, strength, memory, influence_limit, deck_size)
        VALUES
        ('Ayla "Bios" Rahim: Stimulant Specialist', 'identity', null, null, 'shaper', null, null, 15, 45),
        ('Rielle "Kit" Peddler: Transhuman', 'identity', null, null, 'shaper', null, null, 10, 45),
        ('Diesel', 'event', 0, 2, 'shaper', null, null, null, null),
        ('Test Run', 'event', 3, 3, 'shaper', null, null, null, null),
        ('The Maker''s Eye', 'event', 2, 2, 'shaper', null, null, null, null),
        ('Atman', 'program', 3, 3, 'shaper', 0, 1, null, null),
        ('Chameleon', 'program', 2, 3, 'shaper', 3, 1, null, null),
        ('Egret', 'program', 2, 2, 'shaper', null, 1, null, null),
        ('Gordion Blade', 'program', 4, 3, 'shaper', 2, 1, null, null),
        ('Aesop''s Pawnshop', 'resource', 1, 2, 'shaper', null, null, null, null),
        ('Professional Contacts', 'resource', 5, 2, 'shaper', null, null, null, null),
        ('Quetzal: Free Spirit', 'identity', null, null, 'anarch', null, null, 15, 45),
        ('Reina Roja: Freedom Fighter', 'identity', null, null, 'anarch', null, null, 15, 45),
        ('En Passant', 'event', 0, 2, 'anarch', null, null, null, null),
        ('Retrieval Run', 'event', 3, 2, 'anarch', null, null, null, null),
        ('Clot', 'program', 2, 2, 'anarch', null, 1, null, null),
        ('Corroder', 'program', 2, 2, 'anarch', 2, 1, null, null),
        ('Imp', 'program', 2, 3, 'anarch', null, 1, null, null),
        ('Mimic', 'program', 3, 1, 'anarch', 3, 1, null, null),
        ('Ice Carver', 'resource', 3, 3, 'anarch', null, null, null, null),
        ('Liberated Account', 'resource', 6, 2, 'anarch', null, null, null, null),
        ('Scrubber', 'resource', 2, 1, 'anarch', null, null, null, null),
        ('Xanadu', 'resource', 3, 2, 'anarch', null, null, null, null),
        ('Ken "Express" Tenma: Dissapeared Clone', 'identity', null, null, 'criminal', null, null, 15, 45),
        ('Steve Cambridge: Master Grifter', 'identity', null, null, 'criminal', null, null, 15, 45),
        ('Career Fair', 'event', 0, 1, 'criminal', null, null, null, null),
        ('Emergency Shutdown', 'event', 0, 2, 'criminal', null, null, null, null),
        ('Forged Activation Orders', 'event', 1, 2, 'criminal', null, null, null, null),
        ('Inside Job', 'event', 2, 3, 'criminal', null, null, null, null),
        ('Legwork', 'event', 2, 2, 'criminal', null, null, null, null),
        ('Abagnale', 'program', 4, 2, 'criminal', 2, 1, null, null),
        ('Femme Fatale', 'program', 9, 1, 'criminal', 2, 1, null, null),
        ('Sneakdoor Beta', 'program', 4, 3, 'criminal', null, 1, null, null),
        ('Security Testing', 'resource', 0, 3, 'criminal', null, null, null, null),
        ('Dirty Laundry', 'event', 2, 0, 'neutral', null, null, null, null),
        ('PrePaid VoicePAD', 'hardware', 2, 0, 'neutral', null, null, null, null),
        ('Earthrise Hotel', 'resource', 4, 0, 'neutral', null, null, null, null);
        `)
        .then(() => {
            console.log('DB seeded')
            res.status(200).send()
        })
        .catch(err => {
            console.log('Error seeding DB', err)
        })
    }
    
}