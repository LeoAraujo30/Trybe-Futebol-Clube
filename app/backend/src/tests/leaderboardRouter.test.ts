import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import App from '../app';
import TeamModel from '../database/models/TeamModel';
import MatchesService from '../services/MatchesService';
import { mockTeams, mockMatches, mockLeaderboard } from './mocks';
import Imatches from '../interfaces/Imatches';

const matchesService = new MatchesService();

chai.use(chaiHttp);

const { app } = new App();

const { expect } = chai;

describe('Testando as rotas de /leaderboard', async function () {

  before(async () => {
    sinon.stub(TeamModel, "findAll").resolves(mockTeams as TeamModel[]);
    sinon.stub(matchesService, "getByInProgress").resolves(mockMatches as Imatches[]);
  });

  after(()=>{
    (TeamModel.findAll as sinon.SinonStub).restore();
    (matchesService.getByInProgress as sinon.SinonStub).restore();
  })


  it('Testando "/leaderboard"', async function () {
    const response = await chai.request(app).get('/leaderboard');

    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal(mockLeaderboard);
  });
});
