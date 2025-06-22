import React, { useState, useEffect } from 'react';
import api from '../services/api';

const RevisionItem = ({ item, revisionId, onUpdate }) => {
    const [technician, setTechnician] = useState(item.technician || '');
    const [comments, setComments] = useState(item.comments || '');
    
    const handleSave = async () => {
        try {
            await api.put(`/revisions/${revisionId}/items/${item.id}`, { technician, comments });
            alert('Item guardado!');
            onUpdate(); // Para refrescar la lista de revisiones
        } catch (error) {
            console.error('Error updating item:', error);
            alert('Error al guardar el item.');
        }
    };
    
    return (
        <div className="revision-item">
            <h4>{item.item_name}</h4>
            <div className="form-group">
                <label>Técnico</label>
                <input type="text" value={technician} onChange={(e) => setTechnician(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Comentarios</label>
                <textarea value={comments} onChange={(e) => setComments(e.target.value)} rows="3" style={{width: '100%'}}/>
            </div>
            <button onClick={handleSave} className="btn-primary">Guardar Item</button>
        </div>
    );
};


const Revisions = () => {
    const [revisions, setRevisions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPendingRevisions = async () => {
        try {
            setLoading(true);
            const response = await api.get('/revisions/pending');
            setRevisions(response.data);
        } catch (error) {
            console.error("Error fetching pending revisions:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingRevisions();
    }, []);

    if (loading) return <p>Cargando revisiones pendientes...</p>;
    
    return (
        <div>
            <h2>Revisiones Pendientes</h2>
            {revisions.length > 0 ? (
                revisions.map(rev => (
                    <div key={rev.revision_id} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px', borderRadius: '5px' }}>
                        <h3>Vehículo: {rev.plate} ({rev.brand} {rev.line})</h3>
                        <p><strong>Fecha Agendada:</strong> {new Date(rev.scheduled_date).toLocaleString()}</p>
                        {rev.items.map(item => (
                            <RevisionItem key={item.id} item={item} revisionId={rev.revision_id} onUpdate={fetchPendingRevisions} />
                        ))}
                    </div>
                ))
            ) : (
                <p>No hay revisiones pendientes.</p>
            )}
        </div>
    );
};

export default Revisions;