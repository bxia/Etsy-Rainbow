
Team Members: Ruoyu Li, Zi Wang, Bingying Xia


Project: Etsy Rainbow

This tool allows users to browse for Etsy products based on a color map.
Each product shown on the color map is the hottest Etsy product in that 
color. 
(Actually, the hottest Etsy product out of the first 30 results returned 
from Etsy as of now, because the Etsy API is super duper slow.)
Users can also narrow down the search a bit using filters like type, 
price and categories. Ultimately, it's a tool for creating a visually-
engaging casual browsing experience, and is not meant to be used for 
searching for a specific product.

The color maps here functions like an actual map, but is a map of a portion 
of the HSL color space.



* We recommend using Chrome to view this site due to some custom styling
  not available on Firefox, but it would work fine in both Chrome & FF.

  
* Sometimes while trying to retrieve data from Etsy, we get GET errors in
  the console for inexplicable reasons. It would work if you try with a
  different computer or wait a while.





Required elements:

- Javascript: used for all the calculations :)
  We did not use inheritance because we honestly don't need inheritance 
  and we couldn't fit it into the project. We wanted to figure out a way
  to sneak it in if we had time in the end, but alas, we didn't :(

- Canvas: used for transition while zooming into or out of the color map.
  We had planned for a spectacular and colorful canvas transition animation 
  with a 2-D array, but we ran out of time toward the end and couldn't 
  finish it :(  (We each spent 25+ hrs on this project)

- HTML: 
  Forms for the filters, table used for price range slider

- CSS:
  Reset and grid layout provided generously by Twitter bootstrap,
  pseudo-selectors used for styling radio button & check boxes, and of 
  course hover and active states are generously styled.
  Sprite sheets are used. 
  Transitions are used for displaying loaded Etsy product images. 
  Animation is used for loading spinner.

- DOM Manipulation: 
  Used for adding the transition canvas, product images, and product
  details.

- AJAX / JSON-P
  Used for talking to the Etsy API.

- jQuery
  Used to select stuff everywhere, used to animate show/hide of price range
  slider and for imlementing the slider itself, also used for part of the
  zooming transition animation.
