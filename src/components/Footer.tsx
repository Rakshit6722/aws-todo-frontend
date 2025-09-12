import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="footer">
            <Container>
                <Row>
                    <Col md="4">
                        <h5>About Us</h5>
                        <p>
                            We are a team of passionate developers building web applications
                            to solve real-world problems. Follow us on social media to stay updated.
                        </p>
                    </Col>
                    <Col md="4">
                        <h5>Links</h5>
                        <ul className="list-unstyled">
                            <li><a href="/home" className="text-white">Home</a></li>
                            <li><a href="/about" className="text-white">About</a></li>
                            <li><a href="/contact" className="text-white">Contact</a></li>
                            <li><a href="/faq" className="text-white">FAQ</a></li>
                        </ul>
                    </Col>
                    <Col md="4" className="text-center">
                        <h5>Follow Us</h5>
                        <div className="d-flex justify-content-center">
                            <a href="https://facebook.com" className="text-white me-3">
                                <FaFacebook size={24} />
                            </a>
                            <a href="https://twitter.com" className="text-white me-3">
                                <FaTwitter size={24} />
                            </a>
                            <a href="https://instagram.com" className="text-white me-3">
                                <FaInstagram size={24} />
                            </a>
                            <a href="https://linkedin.com" className="text-white">
                                <FaLinkedin size={24} />
                            </a>
                        </div>
                    </Col>
                </Row>
                <Row className="mt-4">
                    <Col className="text-center">
                        <hr className="bg-white" />
                        <p className="mb-0">© 2024 gSoftw4re. All rights reserved.</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}
