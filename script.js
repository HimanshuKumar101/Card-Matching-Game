document.addEventListener('DOMContentLoaded', () => {
    const cardCountInput = document.getElementById('cardCount');
    const startBtn = document.getElementById('startBtn');
    const restartBtn = document.getElementById('restartBtn');
    const gameBoard = document.getElementById('gameBoard');
    const messageEl = document.getElementById('message');
    
    let cards = [];
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let matchedPairs = 0;
    let totalPairs = 0;
    
    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', startGame);
    
    function startGame() {
        const cardCount = parseInt(cardCountInput.value);
        
        // Validate input
        if (isNaN(cardCount) || cardCount < 4 || cardCount > 100) {
            showMessage('Please enter a number between 4 and 100', 'error');
            return;
        }
        
        if (cardCount % 2 !== 0) {
            showMessage('Number of cards must be even', 'error');
            return;
        }
        
        // Reset game state
        cards = [];
        gameBoard.innerHTML = '';
        hasFlippedCard = false;
        lockBoard = false;
        firstCard = secondCard = null;
        matchedPairs = 0;
        totalPairs = cardCount / 2;
        
        // Generate card values
        const values = [];
        for (let i = 1; i <= totalPairs; i++) {
            // Generate random number between 1-100 for each pair
            const value = Math.floor(Math.random() * 100) + 1;
            values.push(value, value);
        }
        
        // Shuffle cards
        shuffleArray(values);
        
        // Create cards
        values.forEach((value, index) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.value = value;
            card.dataset.index = index;
            
            const cardFront = document.createElement('div');
            cardFront.classList.add('card-face', 'card-front');
            cardFront.textContent = value;
            
            const cardBack = document.createElement('div');
            cardBack.classList.add('card-face', 'card-back');
            
            card.appendChild(cardFront);
            card.appendChild(cardBack);
            
            card.addEventListener('click', flipCard);
            gameBoard.appendChild(card);
            cards.push(card);
        });
        
        // Adjust grid layout based on card count
        const columns = Math.min(Math.ceil(Math.sqrt(cardCount)), 6);
        gameBoard.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
        
        showMessage('Game started! Find all matching pairs.', 'success');
        restartBtn.disabled = false;
    }
    
    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;
        if (this.classList.contains('matched')) return;
        
        this.classList.add('flipped');
        
        if (!hasFlippedCard) {
            // First card flip
            hasFlippedCard = true;
            firstCard = this;
            return;
        }
        
        // Second card flip
        secondCard = this;
        checkForMatch();
    }
    
    function checkForMatch() {
        const isMatch = firstCard.dataset.value === secondCard.dataset.value;
        
        if (isMatch) {
            disableCards();
            matchedPairs++;
            if (matchedPairs === totalPairs) {
                setTimeout(() => {
                    showMessage('Congratulations! You found all pairs!', 'success');
                }, 500);
            }
        } else {
            unflipCards();
        }
    }
    
    function disableCards() {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        
        resetBoard();
    }
    
    function unflipCards() {
        lockBoard = true;
        
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            
            resetBoard();
        }, 1000);
    }
    
    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }
    
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    function showMessage(text, type) {
        messageEl.textContent = text;
        messageEl.className = 'message';
        if (type) {
            messageEl.classList.add(type);
        }
    }
});