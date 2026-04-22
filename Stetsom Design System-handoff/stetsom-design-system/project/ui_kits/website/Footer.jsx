// Footer.jsx — Stetsom website footer

Object.assign(window, {
  Footer: function Footer({ onNav }) {
    const col = (title, links) => React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 12 } },
      React.createElement('div', { style: { fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: 14, textTransform: 'uppercase', color: '#fff', marginBottom: 4 } }, title),
      ...links.map(l => React.createElement('a', {
        key: l, onClick: () => onNav && onNav(l.toLowerCase()),
        style: { fontFamily: 'Barlow, sans-serif', fontSize: 14, color: 'rgb(133,133,133)', cursor: 'pointer', textDecoration: 'none' }
      }, l))
    );

    return React.createElement('footer', {
      style: { background: 'rgb(17,17,17)', padding: '48px 100px 24px', boxSizing: 'border-box' }
    },
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: 40 } },
        React.createElement('div', { style: { maxWidth: 253 } },
          React.createElement('img', { src: './assets/brand-image.png', alt: 'Stetsom', style: { height: 49, marginBottom: 16 } }),
          React.createElement('p', { style: { fontFamily: 'Barlow, sans-serif', fontSize: 14, lineHeight: '20px', color: 'rgb(133,133,133)' } },
            'Potência sem limite desde 1989. Fabricamos os melhores amplificadores automotivos do Brasil.'
          )
        ),
        col('Produtos', ['Amplificadores', 'Módulos', 'Subwoofers', 'Acessórios']),
        col('Empresa', ['Sobre nós', 'Suporte', 'Garantia', 'Distribuidores']),
        col('Suporte', ['Central de Ajuda', 'Política de Privacidade', 'Termos de Uso', 'Contato']),
      ),
      React.createElement('div', {
        style: { borderTop: '1px solid rgb(44,44,44)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }
      },
        React.createElement('span', { style: { fontFamily: 'Barlow, sans-serif', fontSize: 13, color: 'rgb(86,86,86)' } }, '© 2024 Stetsom. Todos os direitos reservados.'),
        React.createElement('span', { style: { fontFamily: 'Barlow, sans-serif', fontSize: 13, color: 'rgb(86,86,86)' } }, '@stetsombrasil')
      )
    );
  }
});
