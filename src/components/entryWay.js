import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import './entryWay.css';
import { WIDTHS, BASE_URL } from '../constants';

const handleCreateRoomOnClick = (username) => {
    console.log(`create room for ${username}`);
    fetch(`${BASE_URL}createRoom?username=${username}`).then(
        (res) => {
            console.log(res);
            // useRoomCode()
        },
        (error) => console.log(error)
    );
};
const useRoomCode = newRoomCode => {
    const [roomCode, setRoomCode] = useState('');
    setRoomCode(newRoomCode);

    return roomCode;
}
const handleJoinRoomOnClick = (username) =>
    console.log(`join room as ${username}`);

export const EntryWay = () => {
    const [username, setUsername] = useState('');

    return (
        <div className='EntryWay'>
            <Container fluid>
                <Row xs={WIDTHS.WIDTH_12}>
                    <Col xs={WIDTHS.WIDTH_4}>
                        <InputGroup>
                            <FormControl
                                placeholder='Enter your name'
                                aria-label='Enter Your Name'
                                aria-describedby='basic-addon2'
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </InputGroup>
                    </Col>
                </Row>
                <Row xs={WIDTHS.WIDTH_6}>
                    <Col md={{ offset: WIDTHS.WIDTH_1 }}>
                        <Button
                            variant='outline-info'
                            onClick={() => handleCreateRoomOnClick(username)}
                        >
                            Create Room
                        </Button>{' '}
                        <Button
                            variant='outline-info'
                            onClick={() => handleJoinRoomOnClick(username)}
                        >
                            Join Room
                        </Button>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};
