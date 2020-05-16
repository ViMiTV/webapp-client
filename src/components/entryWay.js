import React, { useState, Component } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import './entryWay.css';
import { WIDTHS, BASE_URL } from '../constants';

class Entry extends Component {
    state = {
        roomCode: '',
        username: '',
    };

    handleCreateRoomOnClick = (username) =>
        fetch(`${BASE_URL}createRoom?username=${username}`).then((res) =>
            res
                .json()
                .then((res) => this.getRoomCode(res.roomId))
                .catch((error) => console.log(error))
        );

    getRoomCode = (roomId) =>
        fetch(`${BASE_URL}getRoomCode?roomId=${roomId}`)
            .then((res) => res.json())
            .then((res) => this.setState({ roomCode: res.roomCode }))
            .catch((error) => console.log(error));

    handleJoinRoomOnClick = (username) =>
        console.log(`join room as ${username}`);

    render() {
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
                                    onChange={(e) =>
                                        this.setState({
                                            username: e.target.value,
                                        })
                                    }
                                />
                            </InputGroup>
                        </Col>
                    </Row>
                    <Row xs={WIDTHS.WIDTH_6}>
                        {this.state.roomCode}
                        <Col md={{ offset: WIDTHS.WIDTH_1 }}>
                            <Button
                                variant='outline-info'
                                onClick={() =>
                                    this.handleCreateRoomOnClick(
                                        this.state.username
                                    )
                                }
                            >
                                Create Room
                            </Button>{' '}
                            <Button
                                variant='outline-info'
                                onClick={() =>
                                    this.handleJoinRoomOnClick(
                                        this.state.username
                                    )
                                }
                            >
                                Join Room
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export const EntryWay = Entry;
