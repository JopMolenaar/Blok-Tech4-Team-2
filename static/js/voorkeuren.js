const Active = document.getElementById('Active');
const Quiet = document.getElementById('Quiet');
const Inside = document.getElementById('Inside');
const Outside = document.getElementById('Outside');
const Both = document.getElementById('Both');
const Big = document.getElementById('Big');
const Small = document.getElementById('Small');
const Middle = document.getElementById('Middle');
const Night = document.getElementById('Night');
const Day = document.getElementById('Day');

const styleText1 = document.getElementById('styleText1');
const styleText2 = document.getElementById('styleText2');
const styleText3 = document.getElementById('styleText3');
const styleText4 = document.getElementById('styleText4');

function updateText() {
  if (!Active.checked && !Quiet.checked) {
    styleText1.innerHTML = '';
  } else {
    styleText1.innerHTML = 'Activity is checked';
  }

  if (!Inside.checked && !Outside.checked && !Both.checked) {
    styleText2.innerHTML = '';
  } else {
    styleText2.innerHTML = 'lifestyle is checked';
  }

  if (!Big.checked && !Small.checked && !Middle.checked) {
    styleText3.innerHTML = '';
  } else {
    styleText3.innerHTML = 'Size is checked';
  }
  if (!Night.checked && !Day.checked) {
    styleText4.innerHTML = '';
  } else {
    styleText4.innerHTML = 'Time is checked';
  }
}

Active.addEventListener('change', updateText);
Quiet.addEventListener('change', updateText);
Inside.addEventListener('change', updateText);
Outside.addEventListener('change', updateText);
Both.addEventListener('change', updateText);
Big.addEventListener('change', updateText);
Small.addEventListener('change', updateText);
Middle.addEventListener('change', updateText);
Night.addEventListener('change', updateText);
Day.addEventListener('change', updateText);


const nextButton = document.getElementById('nextButton');
const checkboxes = document.querySelectorAll('#checkboxes input[type="checkbox"]');
let allLabelsChecked = false;

function updateButton() {
  const labelCheckboxes = document.querySelectorAll('#checkboxes label');
  allLabelsChecked = true;

  labelCheckboxes.forEach(function(label) {
    const checkboxesInLabel = label.querySelectorAll('input[type="checkbox"]');
    let isChecked = false;

    checkboxesInLabel.forEach(function(checkbox) {
      if (checkbox.checked) {
        isChecked = true;
      }
    });

    if (!isChecked) {
      allLabelsChecked = false;
    }
  });

  nextButton.style.backgroundColor = allLabelsChecked ? 'green' : '';
}

checkboxes.forEach(function(checkbox) {
  checkbox.addEventListener('change', updateButton);
});

nextButton.addEventListener('click', function() {
  if (allLabelsChecked) {
    
  } else {
    alert("Not all parts are checked.");
  }
});
