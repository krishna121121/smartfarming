function triggerTransaction(entity) {
    // Get the transaction line and arrow
    const transactionLine = document.querySelector('.transaction-line');
    const arrow = document.querySelector('.arrow');
  
    // Show the transaction line and reset animation
    transactionLine.style.display = 'block';
    arrow.style.animation = 'moveArrow 2s linear forwards';
  
    // Animate the arrow movement and hashing effect
    setTimeout(() => {
      const blockchainBlocks = document.querySelectorAll('.block');
      blockchainBlocks.forEach(block => {
        block.style.animation = 'none'; // Stop blinking effect
        block.style.backgroundColor = '#81d4fa'; // Hash effect
        block.style.animation = 'hashingEffect 1s forwards'; // Apply hashing effect
      });
    }, 2000); // Time for the arrow to pass through
  
    // Reset the blockchain blocks after some time
    setTimeout(() => {
      document.querySelectorAll('.block').forEach(block => {
        block.style.animation = 'blink 2s infinite ease-in-out alternate';
        block.style.backgroundColor = '#42a5f5'; // Reset color
      });
      transactionLine.style.display = 'none'; // Hide the transaction line after animation
    }, 5000); // Reset after 5 seconds
  }
  