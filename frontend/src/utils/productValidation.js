export const validateProduct = (product) => {
    const errors = {};

    // Test product name validation
    if (!product.name || product.name.trim() === '') {
        errors.name = 'Tên sản phẩm không được để trống';
    } else if (product.name.length < 3) {
        errors.name = 'Tên sản phẩm phải có ít nhất 3 ký tự';
    } else if (product.name.length > 100) {
        errors.name = 'Tên sản phẩm không được vượt quá 100 ký tự';
    }

    // Test price validation (boundary tests)
    if (product.price === undefined || product.price === null || product.price === '') {
        errors.price = 'Giá sản phẩm không được để trống';
    } else if (isNaN(product.price) || Number(product.price) <= 0) {
        errors.price = 'Giá sản phẩm phải lớn hơn 0';
    }

    // Test quantity validation
    if (product.quantity === undefined || product.quantity === null || product.quantity === '') {
        errors.quantity = 'Số lượng không được để trống';
    } else if (isNaN(product.quantity) || Number(product.quantity) < 0) {
        errors.quantity = 'Số lượng không được là số âm';
    }

    // Test description length
    if (product.description && product.description.length > 500) {
        errors.description = 'Mô tả không được vượt quá 500 ký tự';
    }

    // Test category validation
    if (!product.category || product.category.trim() === '') {
        errors.category = 'Danh mục không được để trống';
    }

    return errors;
};