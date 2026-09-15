export default function CategorySection() {
  return (
    <section className="category-section" style={{ position: 'relative' }}>
      <img 
        src="/category section copy.png" 
        alt="Category Section" 
        style={{ width: '100%', height: 'auto', display: 'block' }} 
      />

      {/* Transparent Clickable Overlays for the 4 Category Links at the bottom */}
      <div 
        style={{ 
          position: 'absolute', 
          bottom: '2%', 
          left: '5%', 
          width: '90%', 
          height: '10%', 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '2%'
        }}
      >
        <a href="#everyday-juttis" style={{ display: 'block', width: '100%', height: '100%', cursor: 'pointer' }} aria-label="Everyday Juttis" />
        <a href="#statement-juttis" style={{ display: 'block', width: '100%', height: '100%', cursor: 'pointer' }} aria-label="Statement Juttis" />
        <a href="#festive-juttis" style={{ display: 'block', width: '100%', height: '100%', cursor: 'pointer' }} aria-label="Festive Juttis" />
        <a href="#all-juttis" style={{ display: 'block', width: '100%', height: '100%', cursor: 'pointer' }} aria-label="All Juttis" />
      </div>
    </section>
  );
}
