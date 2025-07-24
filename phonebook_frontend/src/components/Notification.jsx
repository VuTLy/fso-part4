const Notification = ({ message, type }) => {
    if (message === null) {
        return null
    }

    const style = {
        color: type === 'error' ? 'red' : 'green',
        background: type === 'error' ? '#ffe0e0' : '#e0ffe0',
        border: `2px solid ${type === 'error' ? 'red' : 'green'}`,
        padding: '10px',
        marginBottom: '15px',
        borderRadius: '5px',
    }
    
    return <div style={style}>{message}</div>
}

export default Notification