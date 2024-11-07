import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';


interface ExportModalProps {
    show: boolean;
    handleClose: () => void;
}

const ExportModal: React.FC<ExportModalProps> = ({ show, handleClose }) => {

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [showWarningModal, setShowWarningModal] = useState(false);

    const handleExport = () => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const differenceInTime = end.getTime() - start.getTime();
        const differenceInDays = differenceInTime / (1000 * 3600 * 24);
        if (differenceInDays > 365) {
            setShowWarningModal(true);
        } else {
            // Call API with startDate and endDate
            handleClose();
        }
    };

    const handleCloseWarningModal = () => setShowWarningModal(false);

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Select Dates</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <label htmlFor="startDate">Start Date:</label>
                        <input
                            type="date"
                            id="startDate"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="endDate">End Date:</label>
                        <input
                            type="date"
                            id="endDate"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleExport}>
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Warning Modal */}
            <Modal show={showWarningModal} onHide={handleCloseWarningModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Warning</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    The selected date range is greater than 1 year. Please select a date range within 1 year.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleCloseWarningModal}>
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ExportModal;
