import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import App from '../app';
import UserModel from '../database/models/UserModel';


import { Response } from 'superagent';

chai.use(chaiHttp);

const { app } = new App();

const { expect } = chai;

const mockLogin = {
  email: 'admin@admin.com',
  password: 'secret_admin',
}

const mockUser = {
  id: 1,
  username: 'Admin',
  email: 'admin@admin.com',
  password: '$2a$08$xi.Hxk1czAO0nZR..B393u10aED0RQ1N3PAEXQ7HxtLjKPEZBu.PW',
  role: 'admin',
}

describe('Testando as rotas de /login', async function () {

  before(async () => {
    sinon.stub(UserModel, "findOne").resolves(mockUser as UserModel);
  });

  after(()=>{
    (UserModel.findOne as sinon.SinonStub).restore();
  })


  it('Testando "/login" em caso de sucesso', async function () {
    const response = await chai.request(app).post('/login').send(mockLogin);

    expect(response.status).to.equal(200);
    expect(response.body.token.startsWith('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9')).to.equal(true);
  });
  it('Testando "/login" caso não tenha passado email ou senha', async function () {
    const response = await chai.request(app).post('/login').send({});

    expect(response.status).to.equal(400);
    expect(response.body).to.deep.equal({ message: 'All fields must be filled' });
  });
  it('Testando "/login" caso tenha passado a senha errada', async function () {
    const response = await chai.request(app).post('/login').send({ ...mockLogin, password: 'adasdadadada',});

    expect(response.status).to.equal(401);
    expect(response.body).to.deep.equal({ message: 'Incorrect email or password' });
  });



  it('Testando "/login/validate" caso tenha passado um token valido', async function () {
    const token = (await chai.request(app).post('/login').send(mockLogin)).body.token;
    const response = await chai.request(app).get('/login/validate').set('authorization', token);

    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal({ role: 'admin' });
  });
  it('Testando "/login/validate" caso tenha passado um token valido', async function () {
    const response = await chai.request(app).get('/login/validate').set('authorization', 'fdafsfsdfdsf');

    expect(response.status).to.equal(401);
    expect(response.body).to.deep.equal({ message: 'Expired or invalid token' });
  });
  it('Testando "/login/validate" caso não tenha passado um token', async function () {
    const response = await chai.request(app).get('/login/validate');

    expect(response.status).to.equal(401);
    expect(response.body).to.deep.equal({ message: 'Token not found' });
  });
});
