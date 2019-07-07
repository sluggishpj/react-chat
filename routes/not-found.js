const Router = require('koa-router');
let router = new Router();

// index
router.get('*', async (ctx) => {
    console.log('status', ctx.status);
    if(ctx.status === 404) {
        console.log('404');
        ctx.redirect('/');
    }else {
        await next();
    }
});

module.exports = router;
