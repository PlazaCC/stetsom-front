// ProductCard.jsx — Stetsom product card

Object.assign(window, {
  ProductCard: function ProductCard({ name, category, spec, badge, img, onClick }) {
    const [hovered, setHovered] = React.useState(false);
    return React.createElement('div', {
      onClick,
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
      style: {
        background: '#fff',
        border: `1px solid ${hovered ? 'rgb(232,19,42)' : 'rgb(217,217,217)'}`,
        borderRadius: 8,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'border-color 0.15s',
        display: 'flex', flexDirection: 'column',
      }
    },
      React.createElement('div', {
        style: { background: 'rgb(248,248,248)', height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }
      },
        img
          ? React.createElement('img', { src: img, alt: name, style: { maxWidth: '90%', maxHeight: 130, objectFit: 'contain', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' } })
          : React.createElement('div', { style: { width: 100, height: 80, background: 'rgb(230,230,230)', borderRadius: 4 } })
      ),
      React.createElement('div', { style: { padding: '12px 14px' } },
        React.createElement('div', {
          style: { fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 500, fontSize: 11, textTransform: 'uppercase', color: 'rgb(232,19,42)', marginBottom: 4 }
        }, category),
        React.createElement('div', {
          style: { fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: 16, textTransform: 'uppercase', color: '#121212', lineHeight: 1.1 }
        }, name),
        spec && React.createElement('div', {
          style: { fontFamily: 'Barlow, sans-serif', fontSize: 12, color: '#888', marginTop: 6 }
        }, spec)
      ),
      React.createElement('div', {
        style: { borderTop: '1px solid rgb(241,241,241)', padding: '8px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }
      },
        badge && React.createElement('span', {
          style: { background: 'rgb(232,19,42)', color: '#fff', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', padding: '2px 8px' }
        }, badge),
        React.createElement('span', {
          style: { fontFamily: 'Barlow Condensed, sans-serif', fontSize: 13, color: 'rgb(232,19,42)', fontWeight: 500, marginLeft: 'auto' }
        }, 'Ver mais ›')
      )
    );
  }
});
