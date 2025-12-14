#codebase 
build livestream based ecommerce for india using python, reactjs and flutter.
there is no 3rd party serviceses.
mobile app (flutter) - only for buyers to participate the live stream join bidding for the product if the user win the bidding the product will added to their cart -> address -> payment(razorpay only) -> order placed screen -> orders history.
web app(react) - only for the sellers. registration(username, name, email, shop name, shop address(india), phone number, aadhar num, pancard -> submit. user cannot able to login untill the account verified. if verified the user can able login), create product(product name, qnty, category, 1 to 3 images), create livestream(title, description, category, products for this stream, schedule the stream or instantly go live). in live able to select product and set timer for the bidding for that product(buyers can able bid and highest bid amount will be the winner), chat and other seller controls for live. order management, payment management, withdraw amount, credits are required for the livestream(when successful registration 1 credit will awarded and buy the credits. every 30 minutes in the live 1 credit will be detucted. if user has no credit ask them to purchase credit to start the live).

use agora, razorpay,

dont use any other 3rd party like firebase, google cloud, redis, etc

fully realtime application
now build complete user app for mobile