import React, { useState, useEffect } from 'react'
import Table from './Table'
import Form from './Form'
import axios from 'axios';


function MyApp() {
    const [characters, setCharacters] = useState([]);
    useEffect(() => {
        fetchAll().then(result => {
            if (result)
                setCharacters(result);
        });
    }, [] );

    async function removeOneCharacter(index) {
        try {
            const id = characters[index].id;
            const response = await axios.delete('http://localhost:5000/users/' + id);
            if (response && response.status === 204) {
                const updated = characters.filter((character, i) => {
                    return i !== index
                });
                setCharacters(updated);
            }
            else {
                console.log('Invalid response: ');
                console.log(response);
            }
            return response;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }

    function updateList(person) {
        makePostCall(person).then(result => {
            if (result && result.status === 201) {
                person = {
                    'id': result.data.id,
                    'name': result.data.name,
                    'job': result.data.job,
                };
                setCharacters([...characters, person]);
            }
        });
    }

    async function makePostCall(person) {
        try {
            const response = await axios.post('http://localhost:5000/users', person);
            return response;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }

    async function fetchAll() {
        try {
            const response = await axios.get("http://localhost:5000/users");
            return response.data.users_list;
        } 
        catch (error) {
            console.log(error);
            return false;
        }
    } 

    return (
        <div className="container">
            <Table characterData={characters} removeCharacter={removeOneCharacter} />
            <Form handleSubmit={updateList} />
        </div>
    );
}

export default MyApp;