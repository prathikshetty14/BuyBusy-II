// ********* Import necessary libraries and functions *********

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { updateDoc, doc, arrayUnion, onSnapshot, arrayRemove } from "firebase/firestore";
import { db } from "../../firebaseInit";

import { toast } from "react-toastify";

// Define the initial state of the product slice
const initialState = {
    cart:[],
    itemInCart:0,
    myorders:[],
    total:0,
    discountCode: [],
}


// Function to get the current date
function getDate() {
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    if(day<10) {
      return `${0}${day}-${month}-${year}`;
    }
    if(month<10) {
        return `${day}-${0}${month}-${year}`;
    }
    return `${day}-${month}-${year}`;
}


// Create an async thunk to fetch the initial cart orders from the database
export const getInitialCartOrdersThunk = createAsyncThunk(
    "product/getCartOrders",
    (args, thunkAPI) => {
        const {authReducer, productReducer} = thunkAPI.getState();
        const {userLoggedIn, isLoggedIn} = authReducer;


        if(isLoggedIn){

            onSnapshot(doc(db, "buybusy", userLoggedIn.id), (doc) => {

                thunkAPI.dispatch(setCart(doc.data().cart));
                thunkAPI.dispatch(setMyOrders(doc.data().orders));
            });

            return productReducer.cart;
        }

    }
)

// Create an async thunk to fetch the initial user orders from the database
export const getInitialMyOrdersThunk = createAsyncThunk(
    "product/getMyOrders",
    (args, thunkAPI) => {
        const {authReducer, productReducer} = thunkAPI.getState();
        const {userLoggedIn, isLoggedIn} = authReducer;

        if(isLoggedIn){
            onSnapshot(doc(db, "buybusy", userLoggedIn.id), (doc) => {
                thunkAPI.dispatch(setMyOrders(doc.data().orders));
            });
            return productReducer.myorders;
        }
    }
)

// Create an async thunk to update the user's cart in the database
export const updateCartInDatabase = createAsyncThunk(
    "product/updateCartInDatabase",
    async(args, thunkAPI) => {

        const {authReducer, productReducer} = thunkAPI.getState();
        const { userLoggedIn } = authReducer;

        const userRef = doc(db, "buybusy", userLoggedIn.id);
        await updateDoc(userRef, {
            cart: productReducer.cart,
        });
    }
)

// Create an async thunk to increase the quantity of a product in the cart
export const increaseQuantThunk = createAsyncThunk(
    "product/increaseProductQuantity",
    async (product,thunkAPI) => {
        const {productReducer} = thunkAPI.getState();
        const index=productReducer.cart.findIndex((item) => item.name === product.name);
    
        thunkAPI.dispatch(increaseProductQuantity(index));      
        thunkAPI.dispatch(increaseTotalAmount(product.price));
        thunkAPI.dispatch(updateCartInDatabase());
    }

)
 
// Create an async thunk to decrease the quantity of a product in the cart
export const decreaseQuantThunk = createAsyncThunk(
    "product/decreaseProductQuantity",
    async(product,thunkAPI) => {

        const { productReducer } = thunkAPI.getState();
        
        const index=productReducer.cart.findIndex((item) => item.name === product.name);
        
        if(productReducer.cart[index].quantity === 1){
            thunkAPI.dispatch(removeFromCartThunk(product));
            return;
        }

        thunkAPI.dispatch(decreaseProductQuantity(index));
        thunkAPI.dispatch(reduceTotalAmount(productReducer.cart[index].price));
        thunkAPI.dispatch(updateCartInDatabase());
        
    }
)

// Create an async thunk to add a product to the cart
export const addToCartThunk = createAsyncThunk(
    "product/addToCart",
    async (product,thunkAPI) => {

        const { authReducer,productReducer } = thunkAPI.getState();
        const {isLoggedIn,userLoggedIn} = authReducer;
        
        if(!isLoggedIn){
            return window.location.href = "/signin";
        }

        const index = productReducer.cart.findIndex((item) => item.name === product.name);

        if(index !== -1){
            thunkAPI.dispatch(increaseQuantThunk(productReducer.cart[index]));
            toast.success("Quantity increased!");
            return;
        }

        const userRef = doc(db, "buybusy", userLoggedIn.id);
        await updateDoc(userRef, {
            cart: arrayUnion({quantity:1,...product})
        });
        
        toast.success("Item added to Cart!");

        thunkAPI.dispatch(increaseTotalAmount(product.price));
        thunkAPI.dispatch(increaseTotalItem());
    }
);

// Create an async thunk to remove a product from the cart
export const removeFromCartThunk = createAsyncThunk(
    "product/removeFromCart",
    async(product,thunkAPI) => {

        const { authReducer } = thunkAPI.getState();
        const {userLoggedIn} = authReducer;
        
        const userRef = doc(db, "buybusy", userLoggedIn.id);
        await updateDoc(userRef, {
            cart: arrayRemove(product)
        });

        toast.success("Item removed from Cart!");
        return product;
    }
);

// Create an async thunk to clear the user's cart
export const clearCartThunk = createAsyncThunk(
    "product/emptyCart",
    async (args,thunkAPI) => {

        const { authReducer, productReducer } = thunkAPI.getState();
        const { userLoggedIn } = authReducer;

        

        if(productReducer.itemInCart.length === 0){
            toast.error("Cart is empty!");   
            return;
        }

        if (!userLoggedIn){
            toast.error("User not logged in. Please log in first.");
            return false;
        }
        const userRef = doc(db, "buybusy", userLoggedIn.id);
        await updateDoc(userRef, {
            cart: [],
        });
        toast.success("Cart is empty");
        return true;
    }
);

// Create an async thunk to complete a purchase and update the user's order history  

export const purchaseAllThunk = createAsyncThunk(
    "product/purchaseAllItems",
    async (args, thunkAPI) => {
    const { authReducer, productReducer } = thunkAPI.getState();
    const { userLoggedIn } = authReducer;

    const currentDate = getDate();

    const userRef = doc(db, "buybusy", userLoggedIn.id);
    let orderData = {
        id: Date.now().toString(),
        date: currentDate,
        list: productReducer.cart,
        amount: productReducer.total,
        discountedAmount: args,
    };

    if (productReducer.myorders.length >= 3 && productReducer.myorders.length % 3 === 0) {
        const discountCode = await thunkAPI.dispatch(generateDiscountCodeThunk());
        orderData = {
        ...orderData,
        discountCode: discountCode.payload,
        };
    }

    await updateDoc(userRef, {
        orders: arrayUnion(orderData),
    });

    thunkAPI.dispatch(clearCartThunk());
    }
);


// Async to generate a Discount Code
export const generateDiscountCodeThunk = createAsyncThunk(
    "product/generateDiscountCode",
    async (args, thunkAPI) => {
        // Generate a unique identifier (timestamp in this case)
        const uniqueIdentifier = Date.now().toString();

        // Your logic for generating a discount code
        const discountCode = `DISCOUNT${uniqueIdentifier}`; // Replace this with your actual logic

        // Dispatch the setDiscountCode action to store the discount code in the state
        thunkAPI.dispatch(setDiscountCode(discountCode));

        // Store the discount code in the user's database
        const { authReducer } = thunkAPI.getState();
        const { userLoggedIn } = authReducer;

        const userRef = doc(db, "buybusy", userLoggedIn.id);
        await updateDoc(userRef, {
            discountCode: arrayUnion(discountCode),
        });

        return discountCode;
    }
);
  


// Create a productSlice using createSlice
const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        setMyOrders: (state,action) => {
            state.myorders = action.payload;
            return;
        },
        setCart: (state,action) => {
            state.cart = action.payload;
            return;
        },
        increaseProductQuantity: (state,action) => {
            const index = action.payload;
            state.cart.at(index).quantity++;
            return;
        },
        decreaseProductQuantity: (state,action) => {
            const index = action.payload;
            state.cart.at(index).quantity--;
            return;
        },
        increaseTotalItem: (state,action) => {
            state.total += action.payload;
            return;
        },
        increaseTotalAmount: (state,action) => {
            state.total += action.payload;
            return;
        },
        reduceTotalAmount: (state,action) => {
            state.total -= action.payload;
            return;
        },
        setDiscountCode: (state, action) => {
            state.discountCode = action.payload;
            return;
        },
    },
    extraReducers: (builder) => {

        builder.addCase(getInitialCartOrdersThunk.fulfilled, (state,action) => {
            const cart = action.payload;
            if(cart){    
                let sum=0,len =0;
                cart.map((item) => {
                    Number(sum += item.price * item.quantity);
                    Number(len += item.quantity);
                });
                state.total = sum;
                state.itemInCart = len;
            }
        })
        
        .addCase(getInitialMyOrdersThunk.fulfilled, (state, action) => {
            state.myorders = action.payload;
        })

        .addCase(increaseQuantThunk.fulfilled, (state,action) => {
            state.itemInCart++;
        })

        .addCase(decreaseQuantThunk.fulfilled, (state,action) => {
            if(state.itemInCart > 1){
                state.itemInCart--;
            }
        })

        .addCase(removeFromCartThunk.fulfilled, (state,action) => {
            const product = action.payload;

            state.total -= product.quantity * product.price;
            state.itemInCart -= product.quantity;

        })

        .addCase(clearCartThunk.fulfilled, (state,action) => {
            state.itemInCart = 0;
            state.total = 0;
            state.cart=[];
        })
    }
})


// Export the productReducer and action creators
export const productReducer = productSlice.reducer;

export const {
    setMyOrders,
    increaseProductQuantity,
    decreaseProductQuantity,
    setCart,
    increaseTotalAmount,
    increaseTotalItem,
    reduceTotalAmount,
    setDiscountCode
} = productSlice.actions;

export const productSelector = (state) => state.productReducer;