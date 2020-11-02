const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid, v4 } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryId(request, response, next) {
  const { id } = request.params

  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid repository ID.' })
  }
  
  if (getRepositoryIndex(id) < 0) {
    return response.status(400).json({ error: 'Repository not found.' })
  }

  return next()
}

function getRepositoryIndex( id ){
  return repositories.findIndex(repository => repository.id === id)
}

app.use('/repositories/:id', validateRepositoryId);

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository ={ id: uuid(), title, url, techs, likes: 0}
  
  repositories.push(repository)

  return response.json(repository)
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params
  const { title, url, techs } = request.body
  

  const repositoryIndex = getRepositoryIndex(id)
  const likes = repositories[repositoryIndex].likes

  const repository = {
    id,
    title,
    url,
    techs,
    likes
  }

  repositories[repositoryIndex] = repository

  return response.json(repository)

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params

  const repositoryIndex = getRepositoryIndex(id)

  repositories.splice(repositoryIndex, 1)

  return response.status(204).send()

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params

  const repositoryIndex = getRepositoryIndex(id)

  repositories[repositoryIndex].likes += 1

  return response.json(repositories[repositoryIndex])
});

module.exports = app;
