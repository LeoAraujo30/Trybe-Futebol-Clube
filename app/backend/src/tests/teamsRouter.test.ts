import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import App from '../app';
import TeamModel from '../database/models/TeamModel';

chai.use(chaiHttp);

const { app } = new App();

const { expect } = chai;

const mockTeam = [
  {
    id: 1,
    teamName: 'Avaí/Kindermann'
  },
  {
    id: 2,
    teamName: 'Bahia'
  },
  {
    id: 3,
    teamName: 'Botafogo'
  },
]

describe('Testando as rotas de /teams', async function () {

  before(async () => {
    sinon.stub(TeamModel, "findAll").resolves(mockTeam as TeamModel[]);
    sinon.stub(TeamModel, "findByPk").resolves(mockTeam[0] as TeamModel);
  });

  after(()=>{
    (TeamModel.findAll as sinon.SinonStub).restore();
    (TeamModel.findByPk as sinon.SinonStub).restore();
  })


  it('Testando "/teams"', async function () {
    const response = await chai.request(app).get('/teams');

    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal(mockTeam);
  });
  it('Testando "/teams/:id"', async function () {
    const response = await chai.request(app).get('/teams/1');

    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal(mockTeam[0]);
  });
});
