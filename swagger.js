/**
 * @swagger
 * components:
 *   schemas:
 *     Products:
 *       type: object
 *       required:
 *         - pdtCatId
 *         - pdtName
 *         - pdtPrice
 *         - pdtDesc
 *         - pdtImg
 *       properties:
 *         _id:
 *           type: number
 *           description: The auto-generated id of the Product
 *         pdtCatId:
 *           type: number
 *           description: Category id of the product
 *         pdtName:
 *           type: string
 *           description: Name of the product
 *         pdtPrice:
 *           type: number
 *           description: Price of the Product
 *         pdtDesc:
 *           type: string
 *           description: Description of the Product
 *         pdtImg:
 *           type: string
 *           description: Image url path of the Product
 *           format: binary
 *       example:
 *         pdtCatId: 1
 *         pdtName: Pepsi
 *         pdtPrice: 100
 *         pdtDesc: Chill with pepsi
 *         pdtImg: productImage-1636693499346.png
 */

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: The Products managing API
 */

/**
 * @swagger
 * /product/list-products:
 *   get:
 *     summary: Returns the list of all the products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: The list of the Products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Products'
 */

/**
 * @swagger
 * /product/list-products/{catid}:
 *   get:
 *     summary: Returns the list of products by catrgory wise
 *     tags: [Products]
 *     parameters:
 *      - in: path
 *        name: catid
 *        schema:
 *          type: string
 *        required: true
 *        description: The catgory ID 
 *     responses:
 *       200:
 *         description: The list of the Products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Products'
 *       404:
 *          description: the route path not found
 *       500:
 *          description: internal server error
 */

/**
 * @swagger
 * components:
 *  schemas:
 *      AddTocart:
 *          type: object
 *          required:
 *              - cartPdtId
 *          properties:
 *              cartPdtId:
 *                  type: string
 *                  description: Product unique ID
 *          example:
 *              cartPdtId: 534g53454h543
 */

/**
 * @swagger
 * /product/add-to-cart:
 *  post:
 *      summary: Add products in logged users cart
 *      tags: [Products]
 *      parameters:
 *          - in: header
 *            name: Authorization
 *            schema:
 *              type: string
 *            required: true
 *            description: The JWT key
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                       $ref: '#/components/schemas/AddTocart'
 *      responses:
 *          200:
 *            description: The cart added successfully
 *          401:
 *             description: Aunthrized user
 * 
 * 
 */