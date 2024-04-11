const validateBody = {
    users: {
        register: {
            first_name: 'required|string|minLength:4|maxLength:15',
            last_name: 'required|string|minLength:4|maxLength:15',
            email: 'required|email|minLength:10',
            password: 'required|string|minLength:6|maxLength:15'
        },
        login: {
            email: 'required|email|minLength:10',
            password: 'required|string|minLength:6|maxLength:15'
        },
        emailCheck: {
            email: 'required|email|minLength:10'
        }
    },
    products: {
        create: {
            product_name: 'required|string|minLength:4',
            product_cat_id: 'required|mongoId',
            product_price: 'required|numeric',
            product_desc: 'required|string|minLength:10',
            product_image: 'required|sometimes'
        },
        addTocart: {
            cartPdtId: 'required|mongoId',
            cartPdtQty: 'required|numeric|sometimes|max:1'
        },
        updateCart: {
            cartId: 'required|mongoId',
            cartPdtQty: 'required|numeric|min:1'
        }
    },
    category: {
        create: {
            category_name: 'required|string|minLength:4'
        }
    }
}

export default validateBody;

