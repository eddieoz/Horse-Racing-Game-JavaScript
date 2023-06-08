const express = require('express')
const axios = require('axios');
const app = express()
const port = 3000

app.use(express.static('public'))

app.get('/proxy', async (req, res) => {
  let { url } = req.query;

  //requet to url
  try {
    const response = await axios.get(url)
    return res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})