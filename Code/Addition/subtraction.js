/***********************************************************************************/
// Subtraction Module

createVector.prototype.subtractVectors = function () {
    if (navigator.vibrate) {
      navigator.vibrate([50]); // Haptic feedback
    }
  
    // Create the resultant vector for subtraction
    this.resultant = this.create_Resultant();
    this.vector_2 = this.create_Vector_2(this.resultant);
    this.vector_1 = this.create_Vector_1(this.resultant, this.vector_2);
  
    // Set subtraction mode
    this.subtraction_mode = true;
    this.manipulationMode = true;
    this.componentized = false;
  
    // Display the additive inverse of the second vector
    this.vector_2.computeAdditiveInverse();
  
    // Add the inverse to the first vector
    this.addVectors();
  };
  
  /***********************************************************************************/
  // Toggle Inverse Display
  
  createVector.prototype.toggleInverse = function () {
    if (this.subtraction_mode) {
      this.vector_2.computeAdditiveInverse(); // Toggle inverse
      this.update_Added_vectors(); // Update the display
    }
  };