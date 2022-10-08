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

let workingDeck = ''

module.exports = {

    createUser: (req, res) => {
        const {userName} = req.body
        sequelize.query(`
            INSERT INTO users (username)
            VALUES ('${userName}');
        `)
        .then(dbRes => {
            res.status(200).send(dbRes[0])        
        })
      
        .catch(() => res.status(400).send())
    },

    deleteUser: (req, res) => {
        const {userName} = req.params
        sequelize.query(`
            DELETE FROM users
            WHERE username = '${userName}';
        `)
        .then(() => res.status(200).send())
        .catch(err => console.log(err))
    },

    getCards: (req, res) => {
        sequelize.query(`
            SELECT * FROM cards
            ORDER BY type, name;
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => console.log(err))
    },

    addCards: (req, res) => {
        const {cardName, cardNumber, deckName} = req.body

        sequelize.query(`
            DELETE FROM cards_to_decks AS ctd
            WHERE decklist_id IN (
                SELECT decklist_id FROM decklists
                WHERE name = '${deckName}'
            )
            AND card_id IN (
                SELECT card_id FROM cards
                WHERE name = '${cardName}'
            );

            INSERT INTO cards_to_decks (decklist_id, card_id)
            VALUES (
                (SELECT decklist_id FROM decklists
                WHERE name = '${deckName}'),
                (SELECT card_id FROM cards
                WHERE name = '${cardName}')
            );

            UPDATE cards_to_decks
            SET number = '${cardNumber}'
            WHERE decklist_id IN (
                SELECT decklist_id FROM decklists
                WHERE name = '${deckName}'
            )
            AND card_id IN (
                SELECT card_id FROM cards
                WHERE name = '${cardName}'
            );
        `)
        .then(() => res.status(200).send())
        .catch(err => console.log(err))

        // sequelize.query(`
        //     SELECT * FROM cards AS c
        //     JOIN cards_to_decks AS ctd
        //     ON c.card_id = ctd.card_id
        //     JOIN decklists AS d
        //     ON d.decklist_id = ctd.decklist_id
        //     WHERE d.name = '${deckName}';
        // `)
    },

    deleteCards: (req, res) => {
        const {cardName} = req.params

        sequelize.query(`
            DELETE FROM cards_to_decks AS ctd
            WHERE decklist_id IN (
                SELECT decklist_id FROM decklists
                WHERE name = '${workingDeck}'
            )
            AND card_id IN (
                SELECT card_id FROM cards
                WHERE name = '${cardName}'
            );
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => console.log(err))
    },

    getIdentities: (req, res) => {
        sequelize.query(`
            SELECT * FROM cards
            WHERE type = 'identity';
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
    },

    getEvents: (req, res) => {
        sequelize.query(`
            SELECT * FROM cards
            WHERE type = 'event';
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
    },

    getPrograms: (req, res) => {
        sequelize.query(`
            SELECT * FROM cards
            WHERE type = 'program';
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
    },

    getHardware: (req, res) => {
        sequelize.query(`
            SELECT * FROM cards
            WHERE type = 'hardware';
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
    },

    getResources: (req, res) => {
        sequelize.query(`
            SELECT * FROM cards
            WHERE type = 'resource';
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
    },

    createDeck: (req, res) => {
        const {deckName, userName} = req.body
        workingDeck = deckName
        sequelize.query(`
            INSERT INTO decklists (user_id, name)
            VALUES (
                (SELECT user_id 
                FROM users 
                WHERE username = '${userName}'), 
                '${deckName}'
                );
        `)
        .then(dbRes => {
            res.status(200).send(dbRes[0])
        })
        .catch(err => res.status(400).send(err))
    },

    getDeck: (req, res) => {

        sequelize.query(`
            SELECT * FROM cards AS c
            JOIN cards_to_decks AS ctd
            ON c.card_id = ctd.card_id
            WHERE ctd.decklist_id IN (
                SELECT decklist_id FROM decklists
                WHERE name = '${workingDeck}'
            )
            ORDER BY type, name
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => console.log(err))
    },

    deleteDeck: (req, res) => {
        const {deckName} = req.params
        console.log(deckName)
        sequelize.query(`
            DELETE FROM cards_to_decks AS ctd
            WHERE decklist_id IN (
            SELECT decklist_id FROM decklists
            WHERE name = '${workingDeck}'
        );
            DELETE FROM decklists
            WHERE name = '${deckName}';
        `)
        .then(() => res.status(200).send())
        .catch(err => console.log(err))

    },

    seed: (req, res) => {
        sequelize.query(`
        DROP TABLE IF EXISTS cards cascade;
        DROP TABLE IF EXISTS users cascade;
        DROP TABLE IF EXISTS cards_to_decks cascade;
        DROP TABLE IF EXISTS decklists cascade;

        CREATE TABLE users (
            user_id SERIAL PRIMARY KEY,
            username VARCHAR(20) UNIQUE
        );

        CREATE TABLE decklists (
            decklist_id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users,
            name VARCHAR(50) UNIQUE
        );

        

        CREATE TABLE cards (
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
            decklist_id INTEGER REFERENCES decklists,
            card_id INTEGER REFERENCES cards,
            number INTEGER
        );

        INSERT INTO users (username)
        VALUES ('Default');

        INSERT INTO cards (name, type, cost, influence, faction, strength, memory, influence_limit, deck_size)
        VALUES
        ('Diesel', 'event', 0, 2, 'shaper', null, null, null, null),
        ('Test Run', 'event', 3, 3, 'shaper', null, null, null, null),
        ('The Makers Eye', 'event', 2, 2, 'shaper', null, null, null, null),
        ('Atman', 'program', 3, 3, 'shaper', 0, 1, null, null),
        ('Chameleon', 'program', 2, 3, 'shaper', 3, 1, null, null),
        ('Egret', 'program', 2, 2, 'shaper', null, 1, null, null),
        ('Gordion Blade', 'program', 4, 3, 'shaper', 2, 1, null, null),
        ('Aesops Pawnshop', 'resource', 1, 2, 'shaper', null, null, null, null),
        ('Professional Contacts', 'resource', 5, 2, 'shaper', null, null, null, null),
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