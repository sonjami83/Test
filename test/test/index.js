const app = require('../app');

const supertest = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const should = chai.should;

const api = supertest('http://localhost:3000');

let login = null;
let users = null;
describe('Tests', () => {

    // Sanity
    it('Sanity check', (done) => {
        api.get('/')
            .then((res) => {
            // expect that / should return Hello World!
            expect(res.text).to.be.equal('Hello World!');
            done();
        }).
        catch(done);
    });

    // Login user with wrong password
    it('Login user with wrong password', (done) => {
        api.post('/sign-in')
            .send({
                password: 'wrong',
                email: 'email',
            })
            .then((res) => {
                // expect that error occurs
                expect(res.body.error).to.be.equal(true);
                done();
            }).
        catch(done);
    });

    // Login with no entered email
    it('Login with no entered email', (done) => {
        api.post('/sign-in')
            .send({
                password: 'password'
            })
            .then((res) => {
                // expect error
                expect(res.body.error).to.be.equal(true);
                done();
            }).
        catch(done);
    });

	// Login user to the system and fetch access token
	it('Login user', (done) => {
		api.post('/sign-in')
			.send({
				password: 'password',
				email: 'email',
			})
			.then((res) => {
				login = res.body.access_token;
				done();
			}).
			catch(done);
	});

	// Get a list of all users
	it('Get users list', (done) => {
		api.get('/users')
			.set('authorization', login)
			.then((res) => {
				// we expect that there is 6 users. You can check/confirm that in app code.
				expect(res.body.length).to.be.equal(6);
				done();
			}).
		catch(done);
	});

    // Get a list of all users without access token
    it('Get a list of all users without access token', (done) => {
        api.get('/users')
            .then((res) => {
                expect(res.body.error).to.be.equal(true);
                done();
            }).
        catch(done);
    });

    // Get user
    it('Get user', (done) => {
        api.get('/users/2')
            .set('authorization', login)
            .then((res) => {
                expect(res.body.user_id).to.be.equal(2);
                done();
            }).
        catch(done);
    });

    // Get user without access token
    it('Get user without access token', (done) => {
        api.get('/users/2')
            .then((res) => {
                expect(res.body.error).to.be.equal(true);
                done();
            }).
        catch(done);
    });

    // Get inactive user
    it('Get inactive user', (done) => {
        api.get('/users/4')
            .set('authorization', login)
            .then((res) => {
                expect(res.body.error).to.be.equal(true);
                done();
            }).
        catch(done);
    });

    // Get account
    it('Get account', (done) => {
        api.get('/users/1/accounts')
            .set('authorization', login)
            .then((res) => {
                expect(res.body.length).to.be.equal(1);
                done();
            }).
        catch(done);
    });

    // Get account without access token
    it('Get account without access token', (done) => {
        api.get('/users/1/accounts')
            .then((res) => {
                expect(res.body.error).to.be.equal(true);
                done();
            }).
        catch(done);
    });

    // Get account for time lord
    it('Get account for time lord', (done) => {
        api.get('/users/5/accounts')
            .set('authorization', login)
            .then((res) => {
                expect(res.body.error).to.be.equal(true);
                done();
            }).
        catch(done);
    });
});