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

if (heartIcon) {
    heartIcon.addEventListener('click', function() {
        heartIcon.classList.toggle('liked');
        heartGroup.classList.toggle('liked');
    });
}

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

    function animatePlasmaSparks() {
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
        requestAnimationFrame(animatePlasmaSparks);
    }

    animatePlasmaSparks();
}

function toggleMenuCard(element) {
  document.querySelectorAll('.card-wrapper').forEach(el => {
    if(el !== element) el.classList.remove('is-active');
  });
  element.classList.toggle('is-active');
}

function triggerCardSparks(e, btn) {
  e.preventDefault();
  e.stopPropagation(); 

  if (window.navigator && window.navigator.vibrate) {
    window.navigator.vibrate(15); 
  }

  const wrapper = btn.closest('.card-wrapper');
  const canvasCard = wrapper.querySelector('.spark-canvas-card');
  const icon = btn.querySelector('i');
  const cardId = wrapper.getAttribute('data-id');
  
  const iconRect = btn.getBoundingClientRect();
  const canvasRect = canvasCard.getBoundingClientRect();
  const startX = iconRect.left - canvasRect.left + (iconRect.width / 2);
  const startY = iconRect.top - canvasRect.top + (iconRect.height / 2);

  fireCardParticles(canvasCard, startX, startY);

  if (icon.classList.contains('fa-arrow-up-right-from-square')) {
    btn.classList.add('pink-active');
    setTimeout(() => {
      window.location.href = "play_chess.html"; 
    }, 400); 
  } else if (icon.classList.contains('fa-bookmark')) {
    btn.classList.toggle('pink-active');
    if (icon.classList.contains('fa-regular')) {
      icon.classList.replace('fa-regular', 'fa-solid');
      localStorage.setItem('savedChessCard', cardId);
    } else {
      icon.classList.replace('fa-solid', 'fa-regular');
      localStorage.removeItem('savedChessCard');
    }
  }
}

function fireCardParticles(canvasCard, x, y) {
  const ctxCard = canvasCard.getContext('2d');
  if (canvasCard.width !== canvasCard.clientWidth || canvasCard.height !== canvasCard.clientHeight) {
    canvasCard.width = canvasCard.clientWidth;
    canvasCard.height = canvasCard.clientHeight;
  }
  if (!canvasCard.sparks) canvasCard.sparks = [];

  const numSparks = 20; 
  const colors = ['232, 146, 164', '118, 150, 86', '234, 224, 213', '255, 255, 255', '255, 215, 0'];

  for (let i = 0; i < numSparks; i++) {
    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 1.2 + 0.5; 
    const color = colors[Math.floor(Math.random() * colors.length)];
    canvasCard.sparks.push({
      x: x,
      y: y,
      size: Math.random() * 1.2 + 0.5, 
      speedX: Math.cos(angle) * velocity,
      speedY: Math.sin(angle) * velocity,
      opacity: 1,
      fadeRate: Math.random() * 0.03 + 0.02, 
      color: color
    });
  }

  if (!canvasCard.isAnimating) {
    canvasCard.isAnimating = true;
    animateCardSparks(canvasCard, ctxCard);
  }
}

function animateCardSparks(canvasCard, ctxCard) {
  ctxCard.clearRect(0, 0, canvasCard.width, canvasCard.height);
  let activeSparks = false;

  for (let i = 0; i < canvasCard.sparks.length; i++) {
    let spark = canvasCard.sparks[i];
    if (spark.opacity <= 0) continue; 
    
    activeSparks = true; 
    spark.x += spark.speedX;
    spark.y += spark.speedY;
    spark.opacity -= spark.fadeRate;

    ctxCard.beginPath();
    ctxCard.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
    const brightOpacity = Math.max(0, spark.opacity);
    ctxCard.fillStyle = `rgba(${spark.color}, ${brightOpacity})`;
    ctxCard.fill();
  }

  if (activeSparks) {
    requestAnimationFrame(() => animateCardSparks(canvasCard, ctxCard));
  } else {
    canvasCard.isAnimating = false;
    canvasCard.sparks = []; 
    ctxCard.clearRect(0, 0, canvasCard.width, canvasCard.height); 
  }
}

document.addEventListener("DOMContentLoaded", function() {
  const savedCardId = localStorage.getItem('savedChessCard');
  if (savedCardId) {
    const gallery = document.querySelector('.gallery');
    const savedCard = document.querySelector(`.card-wrapper[data-id="${savedCardId}"]`);
    if (savedCard && gallery) {
      gallery.prepend(savedCard);
      const bookmarkIcon = savedCard.querySelector('.fa-bookmark');
      if (bookmarkIcon) {
        bookmarkIcon.classList.replace('fa-regular', 'fa-solid');
        bookmarkIcon.parentElement.classList.add('pink-active');
      }
    }
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal-item').forEach((el) => observer.observe(el));
});
                    
