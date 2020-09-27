const express = require('express')
const cors = require('cors')
const axios = require('axios');

const app = express()
app.use(express.json());
app.use(cors());

const port = process.env.SERVER_PORT || 3000;

async function getGrade(occupation) {
    try {
        const resp = await axios.get('http://localhost:8090/salary-grade/' + occupation);
        return resp.data.grade;
    } catch (err) {
        console.error(err);
        throw new Error(err.toString());
    }
}

async function createEmployee(data) {
    try {
        const resp = await axios.post('http://localhost:8091/employee', data);
        return resp.data;
    } catch (err) {
        console.error(err);
        throw new Error(err.toString());
    } 
}

async function getEmployeeByID(id) {
    try {
        console.log("Getting employee");
        const resp = await axios.get(`http://localhost:8091/employee/${id}`);
        return resp.data;
    } catch (err) {
        console.error(err);
        throw new Error(err.toString());
    } 
}

app.get('/get-employee/:id', async (req, res) => {
    const id = req.params.id;

    let employee = {};
    try {
        employee = await getEmployeeByID(id);
    } catch (err) {
        console.error(err);
        return res.status(404).send({
            message: 'Employee Not found'
        });
    }

    res.send(employee)
})

app.post('/create-employee', async (req, res) => {
    const body = req.body;
    const occupation = body.occupation;

    let grade = {};
    try {
        grade = await getGrade(occupation);
    } catch (err) {
        console.error(err);
        return res.status(404).send({
            message: 'Not found'
        });
    }

    let response = {};
    try {
        response = await createEmployee({
            firstName: body.firstName,
            lastName: body.lastName,
            occupation: occupation,
            salaryGrade: grade,
        })

    } catch (err) {
        console.error(err);
        return res.status(500).send({
            message: 'Internal Server Error'
        });
    }

    res.send(response)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
