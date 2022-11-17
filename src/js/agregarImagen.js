import { Dropzone } from 'dropzone'

const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

Dropzone.options.imagen = {
  dictDefaultMessage: 'Sube aquí tus imágenes',
  acceptedFiles: '.png,.jpg,.jpeg,.webp',
  maxFilesize: 5,
  maxFiles: 5,
  parallelUploads: 5,
  autoProcessQueue: false,
  addRemoveLinks: true,
  dictRemoveFile: 'Borrar Archivo',
  dictMaxFilesExceeded: 'El límite son 5 archivos',
  headers: {
    'CSRF-Token': token
  },
  paramName: 'imagen',
  init: function () {
    const dropzone = this
    const btnPublicar = document.querySelector('#publicar')

    btnPublicar.addEventListener('click', function () {
      dropzone.processQueue()
    })

    dropzone.on('queuecomplete', function () {
      if (dropzone.getActiveFiles().length === 0) {
        window.location.href = '/mis-propiedades'
      }
    })
  }
}
