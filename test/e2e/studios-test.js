const {assert} = require('chai');
const mongoose = require('mongoose').connection;
const request = require('./request');
const Studio = require('../../lib/models/Studio');

describe('studio CRUD', () => {

    let rawData = [
        {
            name: 'Touchstone Studio',
            address: {
                city: 'Portland',
                state: 'New Zealand',
                country: 'Mars'
            }
        },
        {
            name: 'Time Warner',
            address: {
                city: 'Burbank',
                state: 'Cali',
                country: 'USA! USA!'
            }
        },      
        {
            name: 'Paramount',
            address: {
                city: 'paris',
                state: 'Paris',
                country: 'PARIS'
            }
        }
    ];
    let ts = null,
        tw = null,
        pm = null;
    beforeEach(() => {
        mongoose.dropDatabase();

        ts = new Studio(rawData[0]);
        tw = new Studio(rawData[1]);
        pm = new Studio(rawData[2]);
    });

    describe('get', () => {
        it('retrieves all items in the database', () => {

            const saveStudios = [
                request.post('/api/studios').send(rawData[0]),
                request.post('/api/studios').send(rawData[1]),
                request.post('/api/studios').send(rawData[2])
            ];
            return Promise.all(saveStudios)
                .then(saved => {
                    saved = saved.map(item => item.body);
                    return request.get('/api/studios')
                        .then(res => {
                            assert.deepEqual(res.body, saved);
                        });
                });
        });
    }) ;

    describe('post', () => {
        it('returns the saved object with _id', () => {
            return request.post('/api/studios')
                .send(tw)
                .then(res => {
                    tw._id = res._id;
                    assert.ok(res.body._id);
                });
        });
    });
});