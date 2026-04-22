// Nav.jsx — Stetsom website navigation
// shared across all pages

Object.assign(window, {
  Nav: function Nav({ activePage, onNav }) {
    return React.createElement('nav', {
      style: {
        width: '100%', height: 88, background: '#fff',
        borderBottom: '1px solid rgb(228,228,231)',
        display: 'flex', alignItems: 'center',
        padding: '0 170px', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100,
        boxSizing: 'border-box',
      }
    },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 51 } },
        React.createElement('img', {
          src: './assets/logo.png', alt: 'Stetsom',
          style: { height: 35, cursor: 'pointer' },
          onClick: () => onNav('home')
        }),
        React.createElement('div', { style: { display: 'flex', gap: 40 } },
          ['Produtos', 'Sobre nós', 'Suporte'].map(link => {
            const page = link === 'Sobre nós' ? 'sobre' : link.toLowerCase();
            return React.createElement('a', {
              key: link,
              onClick: () => onNav(page),
              style: {
                fontFamily: 'Barlow, sans-serif', fontWeight: 600, fontSize: 16,
                color: activePage === page ? 'rgb(232,19,42)' : '#121212',
                cursor: 'pointer', textDecoration: 'none',
                borderBottom: activePage === page ? '2px solid rgb(232,19,42)' : '2px solid transparent',
                paddingBottom: 2,
              }
            }, link);
          })
        )
      ),
      React.createElement('button', {
        style: {
          background: 'rgb(18,18,18)', color: '#fff', border: 'none', cursor: 'pointer',
          fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: 14,
          textTransform: 'uppercase', padding: '0 24px', height: 40, letterSpacing: 0.5,
        }
      }, 'Garantia')
    );
  }
});
