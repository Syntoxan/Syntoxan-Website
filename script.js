 function scrollNext() {
    const track = document.getElementById('imageTrack');
    track.scrollBy({ left: 155, behavior: 'smooth' });
    if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 10) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
    }
}

function toggleMenu() {
    document.getElementById('sidebar').classList.toggle('active');
    document.getElementById('menuOverlay').classList.toggle('active');
}





const heartGroup = document.querySelector('.icon-group');
const heartIcon = document.querySelector('.icon-group svg');


heartIcon.addEventListener('click', function() {
    heartIcon.classList.toggle('liked');
    heartGroup.classList.toggle('liked');
});

 const canvas = document.getElementById('plasma-sparks');

if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = 130; 
    canvas.height = 115;

    const sparks = [];
    const maxSparks = 150;

    function createSpark() {
        return {
            x: canvas.width / 2 + (Math.random() - 0.5) * 80, 
            y: 5,
            size: Math.random() * 1.2 + 0.6, 
            speedY: Math.random() * 1.2 + 0.6, 
            speedX: (Math.random() - 0.5) * 0.6, 
            opacity: 1,
            fadeRate: Math.random() * 0.015 + 0.005, 
            color: Math.random() > 0.5 ? '0, 255, 255' : '100, 255, 255'
        };
    }

    function animateSparks() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (sparks.length < maxSparks && Math.random() < 0.9) {
            sparks.push(createSpark());
            if(Math.random() < 0.5) sparks.push(createSpark());
        }

        for (let i = 0; i < sparks.length; i++) {
            let spark = sparks[i];
            spark.y += spark.speedY;
            spark.x += spark.speedX;
            spark.opacity -= spark.fadeRate;

            if (spark.opacity <= 0.1 || spark.y > canvas.height) {
                sparks[i] = createSpark();
                continue; 
            }

            ctx.beginPath();
            ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
            
            let brightOpacity = Math.max(0.8, spark.opacity);
            ctx.fillStyle = `rgba(${spark.color}, ${brightOpacity})`;
            ctx.fill();
        }
        requestAnimationFrame(animateSparks);
    }

    animateSparks();
}
 
